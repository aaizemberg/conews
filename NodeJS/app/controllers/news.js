/* eslint-disable max-lines */
const { getNews } = require('../services/googleNews'),
  logger = require('../logger'),
  // schedule = require('node-schedule'),
  { News, Feeds, Sources, Stopwords } = require('../models'),
  Sequelize = require('sequelize'),
  { Op } = require('sequelize'),
  { getDate, success, getCurrentDate } = require('./utils'),
  db = require('../models');

exports.getPeriodicNews = (req, res, next) => {
  // schedule.scheduleJob('0 * * * *', () => {
  logger.info('Getting news...');
  return Feeds.findAll()
    .then(async feeds => {
      for (let i = 0; i < /* feeds.length*/ 112; i++) {
        // hasta ambito incluido funciona bien, despues de eso tira errores
        const response = await getNews([feeds[i].url]);
        response.items.map(async item => {
          const news = await News.findOne({
            where: {
              url: item.link
            }
          });
          // TODO: Agregar el title como PK
          if (!news) {
            const { title, link, pubDate, content } = item;
            await News.create({
              title,
              summary: content,
              url: link,
              publicationDate: getDate(new Date(pubDate)),
              content,
              feedId: feeds[i].id
            });
          }
        });
      }
      return res.send('OK');
    })
    .catch(next);
  // });
  // return res.send('Schedule created!');
};

exports.getNewsQuantitySQL = async (req, res) => {
  logger.info('Getting news...');
  const { d_from, d_to, words, sources } = req.query;
  const sources_arr = sources ? sources.split(',') : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const news = await db.sequelize.query(
    '\
  SELECT "News"."publicationDate" AS "date", COUNT("News"."id") AS cantidad \
  FROM "News" INNER JOIN "Feeds" ON "News"."feedId"="Feeds"."id" \
  INNER JOIN "Sources" ON "Feeds"."sourceId"="Sources"."id" \
  WHERE "News"."publicationDate" IS NOT NULL AND "News"."publicationDate" >= (:d_from) \
  AND "News"."publicationDate" <= (:d_to) AND "News"."title" LIKE (:words) AND "Sources"."id" IN (:sources)\
  GROUP BY "News"."publicationDate"\
  ORDER BY "News"."publicationDate" DESC',
    {
      replacements: {
        d_from: d_from ? d_from : getCurrentDate(),
        d_to: d_to ? d_to : getCurrentDate(),
        words: words ? `%${words}%` : '%',
        sources: sources_arr
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  );
  return res.send(success(news));
};

exports.getNewsQuantity = (req, res, next) => {
  logger.info('Getting news...');
  const { d_from, d_to, words } = req.query;
  return News.findAll({
    where: {
      publicationDate: {
        [Op.ne]: null,
        [Op.gt]: d_from ? new Date(d_from) : new Date(getCurrentDate()),
        [Op.lte]: d_to ? new Date(d_to) : new Date(getCurrentDate())
      },
      title: {
        [Op.like]: words ? `%${words}%` : '%'
      }
    },
    attributes: ['publicationDate', [Sequelize.fn('COUNT', Sequelize.col('id')), 'cantidad']],
    group: 'publicationDate',
    order: [['publicationDate', 'DESC']]
  })
    .then(response =>
      /* const formatDateResponse = response.map(item => ({
          publicationDate: getDate(item.publicationDate),
          cantidad: item.cantidad
        }));*/
      res.send(success(response))
    )
    .catch(next);
};

exports.heatmapSQL = async (req, res) => {
  logger.info('Getting news...');
  const { d_from, d_to, words, sources } = req.query;
  const sources_arr = sources ? sources.split(',') : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const news = await db.sequelize.query(
    '\
  SELECT "News"."publicationDate" AS "date", "Sources"."name" AS "source_name", COUNT("News"."id") AS "news_count" \
  FROM "News" INNER JOIN "Feeds" ON "News"."feedId"="Feeds"."id" \
  INNER JOIN "Sources" ON "Feeds"."sourceId"="Sources"."id" \
  WHERE "News"."publicationDate" IS NOT NULL AND "News"."publicationDate" >= (:d_from) \
  AND "News"."publicationDate" <= (:d_to) AND "News"."title" LIKE (:words) AND "Sources"."id" IN (:sources)\
  GROUP BY "News"."publicationDate", "Sources"."name"\
  ORDER BY "News"."publicationDate" DESC',
    {
      replacements: {
        d_from: d_from ? d_from : getCurrentDate(),
        d_to: d_to ? d_to : getCurrentDate(),
        words: words ? `%${words}%` : '%',
        sources: sources_arr
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  );
  return res.send(success(news));
};

exports.heatmap = (req, res, next) => {
  logger.info('Getting news...');
  const { d_from, d_to, words } = req.query;
  return News.findAll({
    where: {
      publicationDate: {
        [Op.ne]: null,
        [Op.gt]: d_from ? new Date(d_from) : new Date(getCurrentDate()),
        [Op.lte]: d_to ? new Date(d_to) : new Date(getCurrentDate())
      },
      title: {
        [Op.like]: words ? `%${words}%` : '%'
      }
    },
    include: [
      {
        model: Feeds,
        as: 'feed',
        attributes: ['id'],
        include: [
          {
            model: Sources,
            as: 'source',
            attributes: ['name']
          }
        ],
        group: ['publicationDate', 'source.name']
      }
    ],
    order: [['publicationDate', 'DESC']]
  })
    .then(response =>
      /* const formatDateResponse = response.map(item => ({
          publicationDate: getDate(item.publicationDate),
          cantidad: item.cantidad
        }));*/
      res.send(success(response))
    )
    .catch(next);
};

exports.searchSQL = async (req, res) => {
  logger.info('Search...');
  const { d_from, d_to, words, sources, page, limit } = req.query;
  const sources_arr = sources ? sources.split(',') : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const news = await db.sequelize.query(
    '\
  SELECT "News"."url", "Sources"."name" AS "source", "News"."summary", "News"."title" \
  FROM "News" INNER JOIN "Feeds" ON "News"."feedId"="Feeds"."id" \
  INNER JOIN "Sources" ON "Feeds"."sourceId"="Sources"."id" \
  WHERE "News"."publicationDate" IS NOT NULL AND "News"."publicationDate" >= (:d_from) \
  AND "News"."publicationDate" <= (:d_to) AND "News"."title" LIKE (:words) AND "Sources"."id" IN (:sources)\
  ORDER BY "News"."id" ASC\
  OFFSET (:offset) ROWS\
  FETCH NEXT (:limit) ROWS ONLY',
    {
      replacements: {
        d_from: d_from ? d_from : getCurrentDate(),
        d_to: d_to ? d_to : getCurrentDate(),
        words: words ? `% ${words} %` : '%',
        sources: sources_arr,
        offset: (page - 1) * limit,
        limit
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  );
  return res.send(success(news));
};

exports.wordtree = async (req, res) => {
  logger.info('Search...');
  const { d_from, d_to, words, sources, page, limit } = req.query;
  const sources_arr = sources ? sources.split(',') : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const news = await db.sequelize.query(
    '\
  SELECT "News"."title" \
  FROM "News" INNER JOIN "Feeds" ON "News"."feedId"="Feeds"."id" \
  INNER JOIN "Sources" ON "Feeds"."sourceId"="Sources"."id" \
  WHERE "News"."publicationDate" IS NOT NULL AND "News"."publicationDate" >= (:d_from) \
  AND "News"."publicationDate" <= (:d_to) AND "News"."title" LIKE (:words) AND "Sources"."id" IN (:sources)\
  ORDER BY "News"."id" ASC\
  OFFSET (:offset) ROWS\
  FETCH NEXT (:limit) ROWS ONLY',
    {
      replacements: {
        d_from: d_from ? d_from : getCurrentDate(),
        d_to: d_to ? d_to : getCurrentDate(),
        words: words ? `% ${words} %` : '%',
        sources: sources_arr,
        offset: (page - 1) * limit,
        limit
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  );
  return res.send(success(news));
};

exports.search = (req, res, next) => {
  const { words, limit, d_from, d_to } = req.query;
  News.findAndCountAll({
    where: {
      publicationDate: {
        [Op.ne]: null,
        [Op.gt]: d_from ? new Date(d_from) : new Date(getCurrentDate()),
        [Op.lte]: d_to ? new Date(d_to) : new Date(getCurrentDate())
      },
      title: {
        [Op.like]: words ? `% ${words} %` : '%'
      },
      feedId: {
        source: {
          id: {
            [Op.eq]: 1
          }
        }
      }
    },
    include: [
      {
        model: Feeds,
        as: 'feed',
        attributes: ['id'],
        include: [
          {
            model: Sources,
            as: 'source',
            attributes: ['id']
          }
        ]
      }
    ],
    limit,
    offset: req.skip,
    order: [['id', 'ASC']]
  })
    .then(results => {
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / limit);
      return res.send({
        page: results.rows,
        currentPage: req.query.page,
        totalPages: pageCount,
        totalItems: itemCount
      });
    })
    .catch(next);
};

// eslint-disable-next-line complexity
exports.wordcloud = async (req, res) => {
  logger.info('Word cloud...');
  const { d_from, d_to, words, sources, limit, stopwords } = req.query;
  const sources_arr = sources ? sources.split(',') : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const news = await db.sequelize.query(
    '\
  SELECT "News"."title" \
  FROM "News" INNER JOIN "Feeds" ON "News"."feedId"="Feeds"."id" \
  INNER JOIN "Sources" ON "Feeds"."sourceId"="Sources"."id" \
  WHERE "News"."publicationDate" IS NOT NULL AND "News"."publicationDate" >= (:d_from) \
  AND "News"."publicationDate" <= (:d_to) AND "News"."title" LIKE (:words) AND "Sources"."id" IN (:sources)\
  ORDER BY "News"."id" ASC',
    {
      replacements: {
        d_from: d_from ? d_from : getCurrentDate(),
        d_to: d_to ? d_to : getCurrentDate(),
        words: words ? `% ${words} %` : '%',
        sources: sources_arr
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  );
  let response = [];
  for (let i = 0; i < news.length; i++) {
    const title = news[i].title
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
  const queryStopwords = stopwords ? stopwords.split(',') : [];
  allStopwords = [...allStopwords, ...queryStopwords];
  response = response.filter(item => !allStopwords.includes(item.word));
  response = response.slice(0, limit);
  return res.send(success(response));
};

// eslint-disable-next-line complexity
exports.trends = async (req, res) => {
  logger.info('Tendencias...');
  const { d_from, d_to, words, sources } = req.query;
  const sources_arr = sources ? sources.split(',') : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
  const words_arr = words ? words.split(',') : [];
  const news = await db.sequelize.query(
    '\
  SELECT "News"."title", "News"."publicationDate" AS "publication_date" \
  FROM "News" INNER JOIN "Feeds" ON "News"."feedId"="Feeds"."id" \
  INNER JOIN "Sources" ON "Feeds"."sourceId"="Sources"."id" \
  WHERE "News"."publicationDate" IS NOT NULL AND "News"."publicationDate" >= (:d_from) \
  AND "News"."publicationDate" <= (:d_to) AND "Sources"."id" IN (:sources)\
  ORDER BY "News"."publicationDate" ASC',
    {
      replacements: {
        d_from: d_from ? d_from : getCurrentDate(),
        d_to: d_to ? d_to : getCurrentDate(),
        sources: sources_arr
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  );
  let response = [];
  let max_times = 0;
  for (let i = 0; i < news.length; i++) {
    const title = news[i].title
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
          [words_arr[j]]: previous_obj[words_arr[j]] + title.split(` ${words_arr[j]} `).length - 1
        };
        if (previous_obj[words_arr[j]] > max_times) {
          max_times = previous_obj[words_arr[j]];
        }
      }
      response[response.length - 1] = previous_obj;
    }
  }
  for (let i = 0; i < response.length; i++) {
    let obj = response[i];
    const keys = Object.keys(obj);
    for (let j = 1; j < keys.length; j++) {
      // eslint-disable-next-line no-extra-parens
      obj = { ...obj, [keys[j]]: Math.round((obj[keys[j]] / max_times) * 100) };
    }
    response[i] = obj;
  }
  return res.send(response);
};

exports.insertStopword = async (req, res) => {
  await Stopwords.create({
    word: req.query.word
  });
  return res.send('Ok, inserted stopword');
};
