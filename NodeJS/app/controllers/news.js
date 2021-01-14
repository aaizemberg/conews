const { getNews } = require('../services/googleNews'),
  logger = require('../logger'),
  // schedule = require('node-schedule'),
  { News, Feeds } = require('../models'),
  Sequelize = require('sequelize'),
  { Op } = require('sequelize'),
  { getDate, success } = require('./utils');

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
