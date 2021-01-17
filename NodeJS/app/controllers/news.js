const { getNews } = require('../services/googleNews'),
  logger = require('../logger'),
  // schedule = require('node-schedule'),
  { News, Feeds, Sources } = require('../models'),
  Sequelize = require('sequelize'),
  { Op } = require('sequelize'),
  { getDate, success } = require('./utils'),
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
  SELECT "News"."publicationDate", COUNT("News"."id") AS Cantidad \
  FROM "News" INNER JOIN "Feeds" ON "News"."feedId"="Feeds"."id" \
  INNER JOIN "Sources" ON "Feeds"."sourceId"="Sources"."id" \
  WHERE "News"."publicationDate" IS NOT NULL AND "News"."publicationDate" >= (:d_from) \
  AND "News"."publicationDate" <= (:d_to) AND "News"."title" LIKE (:words) AND "Sources"."id" IN (:sources)\
  GROUP BY "News"."publicationDate"\
  ORDER BY "News"."publicationDate" DESC',
    {
      replacements: {
        d_from: d_from ? d_from : '2000-01-01',
        d_to: d_to ? d_to : '2100-01-01',
        words: words ? `%${words}%` : '%',
        sources: sources_arr
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  );
  return res.send(news);
};

exports.getNewsQuantity = (req, res, next) => {
  logger.info('Getting news...');
  const { d_from, d_to, words } = req.query;
  return News.findAll({
    where: {
      publicationDate: {
        [Op.ne]: null,
        [Op.gt]: d_from ? new Date(d_from) : new Date('2000-01-01'),
        [Op.lte]: d_to ? new Date(d_to) : new Date('2100-01-01')
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
  SELECT "News"."publicationDate", "Sources"."name" AS "source_name", COUNT("News"."id") AS Cantidad \
  FROM "News" INNER JOIN "Feeds" ON "News"."feedId"="Feeds"."id" \
  INNER JOIN "Sources" ON "Feeds"."sourceId"="Sources"."id" \
  WHERE "News"."publicationDate" IS NOT NULL AND "News"."publicationDate" >= (:d_from) \
  AND "News"."publicationDate" <= (:d_to) AND "News"."title" LIKE (:words) AND "Sources"."id" IN (:sources)\
  GROUP BY "News"."publicationDate", "Sources"."name"\
  ORDER BY "News"."publicationDate" DESC',
    {
      replacements: {
        d_from: d_from ? d_from : '2000-01-01',
        d_to: d_to ? d_to : '2100-01-01',
        words: words ? `%${words}%` : '%',
        sources: sources_arr
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  );
  return res.send(news);
};

exports.heatmap = (req, res, next) => {
  logger.info('Getting news...');
  const { d_from, d_to, words } = req.query;
  return News.findAll({
    where: {
      publicationDate: {
        [Op.ne]: null,
        [Op.gt]: d_from ? new Date(d_from) : new Date('2000-01-01'),
        [Op.lte]: d_to ? new Date(d_to) : new Date('2100-01-01')
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
