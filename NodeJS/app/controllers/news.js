const { getNews } = require('../services/googleNews'),
  logger = require('../logger'),
  // schedule = require('node-schedule'),
  { News, Feeds } = require('../models');

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
              publicationDate: pubDate,
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
  return News.findAll()
    .then(response => res.send(response))
    .catch(next);
};
