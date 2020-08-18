const { getNews } = require('../services/googleNews'),
  logger = require('../logger'),
  schedule = require('node-schedule'),
  { GoogleNews } = require('../models');

exports.getPeriodicGoogleNews = (req, res, next) => {
  schedule.scheduleJob('0 * * * *', () => {
    logger.info('Getting Google news...');
    return getNews()
      .then(response => {
        response.items.map(async item => {
          const news = await GoogleNews.findOne({
            where: {
              link: item.link
            }
          });
          if (!news) {
            const { title, link, pubDate, content } = item;
            const source = title.split(' - ');
            await GoogleNews.create({
              title,
              link,
              pubDate,
              content,
              source: source[source.length - 1]
            });
          }
        });
        return res.send('OK');
      })
      .catch(next);
  });
  return res.send('Schedule created!');
};

exports.getGoogleNews = (req, res, next) => {
  logger.info('Getting news...');
  return GoogleNews.findAll()
    .then(response => {
      logger.info('Google news found');
      return res.send(response);
    })
    .catch(next);
};
