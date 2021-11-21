/* eslint-disable max-lines */
/* eslint-disable no-loop-func */
/* eslint-disable max-lines */
/* eslint-disable max-statements */
/* eslint-disable max-lines */
const axios = require('axios');
const { getNews } = require('../services/googleNews'),
  logger = require('../logger'),
  schedule = require('node-schedule'),
  { News, Sources, Stopwords, Entities, EntitiesNews } = require('../models'),
  { success, getCurrentDate } = require('./utils'),
  { DEFAULT_ARRAY, DEFAULT_TYPES_ENTITIES } = require('./constants'),
  db = require('../models');

const getPeriodicNewsJob = () => {
  logger.info('Getting news...');
  return Sources.findAll()
    .then(async sources => {
      for (let i = 0; i < sources.length; i++) {
        try {
          const response = await getNews([sources[i].url]);
          await Sources.update(
            {
              lastUpdate: getCurrentDate()
            },
            {
              where: { url: sources[i].url }
            }
          );
          response.items.map(async item => {
            const { title, link, pubDate } = item;
            if (link.startsWith(sources[i].url)) {
              const itemTitle = title.split(' - ')[0];
              await News.findOrCreate({
                where: {
                  url: item.link,
                  title: item.title.split(' - ')[0]
                },
                defaults: {
                  title: itemTitle,
                  url: link,
                  publicationDate: new Date(pubDate),
                  sourceId: sources[i].id
                }
              });
            }
          });
        } catch (error) {
          logger.info(error);
        }
      }
    })
    .catch(error => logger.info(error));
};

exports.getEntities = async (req, res) => {
  logger.info('Searching for entities...');
  const { d_from, d_to, types, sources } = req.query;
  const types_arr = types ? types.split(',') : DEFAULT_TYPES_ENTITIES;
  const sources_arr = sources ? sources.split(',') : DEFAULT_ARRAY;
  const entities = await db.sequelize
    .query(
      '\
    SELECT "Entities"."name" AS "entity", "Entities"."type", "Entities"."id", COUNT(*) AS quantity \
    FROM "Entities" INNER JOIN "EntitiesNews" ON "Entities"."id"="EntitiesNews"."entityId"\
    INNER JOIN "News" ON "EntitiesNews"."newId"="News"."id" \
    INNER JOIN "Sources" ON "News"."sourceId"="Sources"."id" \
    WHERE "News"."publicationDate" IS NOT NULL \
      AND date("News"."publicationDate") >= (:d_from) \
      AND date("News"."publicationDate") <= (:d_to) \
      AND "Entities"."type" IN (:types) \
      AND "Sources"."id" IN (:sources) \
    GROUP BY "Entities"."id"\
    ORDER BY quantity DESC',
      {
        replacements: {
          d_from: d_from ? d_from : getCurrentDate(),
          d_to: d_to ? d_to : getCurrentDate(),
          types: types_arr,
          sources: sources_arr
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    )
    .catch(error => logger.info(error));
  return res.send(success(entities));
};

const extractEntities = async news => {
  logger.info(`Extracting entities for article with id ${news.id}...`);

  //  TODO: credentials shouldn't be stored within code

  try {
    await axios({
      url: 'https://nerd.it.itba.edu.ar/api/auth/token',
      method: 'post',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        grant_type: 'password',
        username: 'nerdapi@mailinator.com',
        password: 'p455w0rd'
      }
    })
      .then(async resultNerd => {
        const { access_token } = resultNerd.data;
        if (access_token === null && access_token === undefined) {
          throw new Error('Login failed');
        } else {
          const response = await axios({
            url: 'https://nerd.it.itba.edu.ar/api/ner/current/entities',
            method: 'post',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`
            },
            data: {
              text: news.title
            }
          });
          return response;
        }
      })
      .then(async response => {
        const { entities } = response.data;
        if (entities === null && entities === undefined) {
          throw new Error('Nerd API is not returning any valid entity');
        } else {
          for (let i = 0; i < entities.length; i++) {
            entities[i].name = news.title.slice(entities[i].start, entities[i].end);
            const [entity] = await Entities.findOrCreate({
              where: {
                name: entities[i].name,
                type: entities[i].label,
                field: 'TITLE',
                program: 'NERD_API'
              }
            });
            await EntitiesNews.create({
              entityId: entity.id,
              newId: news.id
            });
          }
          return entities;
        }
      })
      .then(async response => {
        if (response !== null && response !== undefined) {
          await News.update(
            { entitiesCalculated: true },
            {
              where: {
                id: news.id
              }
            }
          );
        }
      });
  } catch (error) {
    // Error 😨
    if (error.response) {
      /*
       * The request was made and the server responded with a
       * status code that falls out of the range of 2xx
       */
      logger.info(error.response.data);
      logger.info(error.response.status);
      logger.info(error.response.headers);
    } else if (error.request) {
      /*
       * The request was made but no response was received, `error.request`
       * is an instance of XMLHttpRequest in the browser and an instance
       * of http.ClientRequest in Node.js
       */
      logger.info(error.request);
    } else {
      // Something happened in setting up the request and triggered an Error
      logger.info('Error', error.message);
    }
    logger.info(error);
  }
};

const extractAllEntities = () => {
  logger.info('Extracting all entities...');
  return News.findAll({
    where: {
      entitiesCalculated: false,
    }
  })
    .then(async news => {
      for (let i = 0; i < news.length; i++) {
        await extractEntities(news[i]);
      }
      logger.info('Extracting all entities finished');
    })
    .catch(error => logger.info(error));
};

exports.extractPeriodicEntities = () => {
  // 30 minutes past every hour
  schedule.scheduleJob('30 * * * *', () => {
    extractAllEntities();
  });
  logger.info('Schedule for Entities created!');
};

exports.getPeriodicNews = () => {
  getPeriodicNewsJob();
  schedule.scheduleJob('0 * * * *', () => {
    getPeriodicNewsJob();
  });
  logger.info('Schedule created!');
};

exports.getNewsQuantitySQL = async (req, res) => {
  logger.info('Getting news...');
  const { d_from, d_to, words, sources } = req.query;
  const sources_arr = sources ? sources.split(',') : DEFAULT_ARRAY;
  const news = await db.sequelize
    .query(
      '\
      SELECT date("News"."publicationDate") AS "date", COUNT("News"."id") AS cantidad \
      FROM "News" INNER JOIN "Sources" ON "News"."sourceId"="Sources"."id" \
      WHERE "News"."publicationDate" IS NOT NULL AND date("News"."publicationDate") >= (:d_from) \
        AND date("News"."publicationDate") <= (:d_to) AND LOWER("News"."title") LIKE (:words) \
        AND "Sources"."id" IN (:sources) \
      GROUP BY date("News"."publicationDate") \
      ORDER BY date("News"."publicationDate") DESC',
      {
        replacements: {
          d_from: d_from ? d_from : getCurrentDate(),
          d_to: d_to ? d_to : getCurrentDate(),
          words: words ? `%${words.toLowerCase()}%` : '%',
          sources: sources_arr
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    )
    .catch(error => logger.info(error));
  return res.send(success(news));
};

exports.heatmapSQL = async (req, res) => {
  logger.info('Getting news...');
  const { d_from, d_to, words, sources } = req.query;
  const sources_arr = sources ? sources.split(',') : DEFAULT_ARRAY;
  const news = await db.sequelize
    .query(
      '\
      SELECT date("News"."publicationDate") AS "date", "Sources"."name" AS "source_name", \
             COUNT("News"."id") AS "news_count" \
      FROM "News" INNER JOIN "Sources" ON "News"."sourceId"="Sources"."id" \
      WHERE "News"."publicationDate" IS NOT NULL \
        AND date("News"."publicationDate") >= (:d_from) \
        AND date("News"."publicationDate") <= (:d_to) \
        AND LOWER("News"."title") LIKE (:words) \
        AND "Sources"."id" IN (:sources)\
      GROUP BY date("News"."publicationDate"), "Sources"."name"\
      ORDER BY date("News"."publicationDate") DESC',
      {
        replacements: {
          d_from: d_from ? d_from : getCurrentDate(),
          d_to: d_to ? d_to : getCurrentDate(),
          words: words ? `%${words.toLowerCase()}%` : '%',
          sources: sources_arr
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    )
    .catch(error => logger.info(error));
  return res.send(success(news));
};

exports.searchSQL = async (req, res) => {
  logger.info('Search...');
  const { d_from, d_to, words, sources, page, limit } = req.query;
  const sources_arr = sources ? sources.split(',') : DEFAULT_ARRAY;
  const news = await db.sequelize
    .query(
      '\
    SELECT "News"."url", "Sources"."name" AS "source", "News"."title", "News"."publicationDate" \
    FROM "News" INNER JOIN "Sources" ON "News"."sourceId"="Sources"."id" \
    WHERE "News"."publicationDate" IS NOT NULL \
      AND date("News"."publicationDate") >= (:d_from) \
      AND date("News"."publicationDate") <= (:d_to) \
      AND LOWER("News"."title") LIKE (:words) \
      AND "Sources"."id" IN (:sources) \
    ORDER BY "News"."id" ASC\
    OFFSET (:offset) ROWS\
    FETCH NEXT (:limit) ROWS ONLY',
      {
        replacements: {
          d_from: d_from ? d_from : getCurrentDate(),
          d_to: d_to ? d_to : getCurrentDate(),
          words: words ? `%${words.toLowerCase()}%` : '%',
          sources: sources_arr,
          offset: (page - 1) * limit,
          limit
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    )
    .catch(error => logger.info(error));
  return res.send(success(news));
};

exports.wordtree = async (req, res) => {
  logger.info('Search...');
  const { d_from, d_to, words, sources, page, limit } = req.query;
  const sources_arr = sources ? sources.split(',') : DEFAULT_ARRAY;
  const news = await db.sequelize
    .query(
      '\
    SELECT "News"."title" \
    FROM "News" INNER JOIN "Sources" ON "News"."sourceId"="Sources"."id" \
    WHERE "News"."publicationDate" IS NOT NULL \
      AND date("News"."publicationDate") >= (:d_from) \
      AND date("News"."publicationDate") <= (:d_to) \
      AND LOWER("News"."title") LIKE (:words) \
      AND "Sources"."id" IN (:sources)\
    ORDER BY "News"."id" ASC\
    OFFSET (:offset) ROWS\
    FETCH NEXT (:limit) ROWS ONLY',
      {
        replacements: {
          d_from: d_from ? d_from : getCurrentDate(),
          d_to: d_to ? d_to : getCurrentDate(),
          words: words ? `%${words.toLowerCase()}%` : '%',
          sources: sources_arr,
          offset: (page - 1) * limit,
          limit
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    )
    .catch(error => logger.info(error));
  return res.send(success(news));
};

// eslint-disable-next-line complexity
exports.wordcloud = async (req, res) => {
  logger.info('Word cloud...');
  const { d_from, d_to, words, sources, limit, stopwords } = req.query;
  const sources_arr = sources ? sources.split(',') : DEFAULT_ARRAY;
  const news = await db.sequelize
    .query(
      '\
    SELECT "News"."title" \
    FROM "News" INNER JOIN "Sources" ON "News"."sourceId"="Sources"."id" \
    WHERE "News"."publicationDate" IS NOT NULL \
      AND date("News"."publicationDate") >= (:d_from) \
      AND date("News"."publicationDate") <= (:d_to) \
      AND LOWER("News"."title") LIKE (:words) \
      AND "Sources"."id" IN (:sources) \
    ORDER BY "News"."id" ASC',
      {
        replacements: {
          d_from: d_from ? d_from : getCurrentDate(),
          d_to: d_to ? d_to : getCurrentDate(),
          words: words ? `%${words.toLowerCase()}%` : '%',
          sources: sources_arr
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    )
    .catch(error => logger.info(error));
  let response = [];
  for (let i = 0; i < news.length; i++) {
    const title = news[i].title
      .toLowerCase()
      .replace(',', '')
      .replace(':', '')
      .replace('"', '')
      .replace('.', '');
    const titleWords = title.split(' ');
    let found = false;
    for (let j = 0; j < titleWords.length; j++) {
      if (response.length === 0) {
        response = [{ word: titleWords[j], word_count: 1 }];
      }
      found = false;
      for (let k = 0; k < response.length; k++) {
        if (response[k].word === titleWords[j]) {
          response[k] = { word: response[k].word, word_count: response[k].word_count + 1 };
          found = true;
          break;
        }
      }
      if (!found) {
        response = [...response, { word: titleWords[j], word_count: 1 }];
      }
    }
  }
  response.sort((a, b) => b.word_count - a.word_count);
  let allStopwords = await Stopwords.findAll();
  allStopwords = allStopwords.map(s => s.word);
  const queryStopwords = stopwords ? stopwords.split(',').map(word => word.toLowerCase()) : [];
  allStopwords = [...allStopwords, ...queryStopwords];
  response = response.filter(item => !allStopwords.includes(item.word));
  response = response.slice(0, limit);
  logger.info(`Limit: ${limit}`);
  return res.send(success(response));
};

// eslint-disable-next-line complexity
exports.trends = async (req, res) => {
  logger.info('Tendencias...');
  const { d_from, d_to, words, sources, debug } = req.query;
  const sources_arr = sources ? sources.split(',') : DEFAULT_ARRAY;
  let words_arr = words ? words.split(',') : [];
  words_arr = words_arr.map(word => word.toLowerCase());
  const news = await db.sequelize
    .query(
      '\
    SELECT "News"."title", "News"."publicationDate" AS "publication_date" \
    FROM "News" INNER JOIN "Sources" ON "News"."sourceId"="Sources"."id" \
    WHERE "News"."publicationDate" IS NOT NULL \
      AND date("News"."publicationDate") >= (:d_from) \
      AND date("News"."publicationDate") <= (:d_to) \
      AND "Sources"."id" IN (:sources) \
    ORDER BY "News"."publicationDate" ',
      {
        replacements: {
          d_from: d_from ? d_from : getCurrentDate(),
          d_to: d_to ? d_to : getCurrentDate(),
          sources: sources_arr
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    )
    .catch(error => logger.info(error));
  let response = [];
  let max_times = 0;
  for (let i = 0; i < news.length; i++) {
    const title = news[i].title
      .toLowerCase()
      .replace(',', '')
      .replace(':', '')
      .replace('"', '')
      .replace('.', '');
    logger.info(title);
    if (i === 0 || news[i - 1].publication_date !== news[i].publication_date) {
      let words_obj = {};
      for (let j = 0; j < words_arr.length; j++) {
        words_obj = { ...words_obj, [words_arr[j]]: title.split(`${words_arr[j]}`).length - 1 };
        if (words_obj[words_arr[j]] > max_times) {
          max_times = words_obj[words_arr[j]];
        }
      }
      response = [...response, { publication_date: news[i].publication_date, ...words_obj }];
    } else {
      let previous_obj = response[response.length - 1];
      for (let j = 0; j < words_arr.length; j++) {
        previous_obj = {
          ...previous_obj,
          [words_arr[j]]: previous_obj[words_arr[j]] + title.split(`${words_arr[j]}`).length - 1
        };
        if (previous_obj[words_arr[j]] > max_times) {
          max_times = previous_obj[words_arr[j]];
        }
      }
      response[response.length - 1] = previous_obj;
    }
  }
  if (debug !== 'true') {
    for (let i = 0; i < response.length; i++) {
      let obj = response[i];
      const keys = Object.keys(obj);
      for (let j = 1; j < keys.length; j++) {
        // eslint-disable-next-line no-extra-parens
        obj = { ...obj, [keys[j]]: Math.round((obj[keys[j]] / max_times) * 100) };
      }
      response[i] = obj;
    }
  }
  return res.send(response);
};

exports.insertStopword = async (req, res) => {
  await Stopwords.create({
    word: req.query.word
  }).catch(error => logger.info(error));
  return res.send('Ok, inserted stopword');
};

exports.insertSource = async (req, res) => {
  await Sources.create({
    name: req.query.name,
    url: req.query.url
  }).catch(error => logger.info(error));
  return res.send('Ok, inserted source');
};

exports.getStopwords = async (req, res) => {
  const response = await Stopwords.findAll().catch(error => logger.info(error));
  return res.send(response);
};

exports.deleteStopword = async (req, res) => {
  const stopword = await Stopwords.findOne({
    where: {
      word: req.query.word
    }
  }).catch(error => logger.info(error));
  if (!stopword) {
    return res.status(400).send('Cannot find stopword');
  }
  await Stopwords.destroy({
    where: {
      word: req.query.word
    }
  }).catch(error => logger.info(error));
  return res.send('Ok, deleted stopword');
};

exports.deleteSource = async (req, res) => {
  const source = await Sources.findOne({
    where: {
      name: req.query.name
    }
  }).catch(error => logger.info(error));
  if (!source) {
    return res.status(400).send('Cannot find source');
  }
  await Sources.destroy({
    where: {
      name: req.query.name
    }
  }).catch(error => logger.info(error));
  return res.send('Ok, deleted source');
};
