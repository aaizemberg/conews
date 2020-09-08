const { getNews } = require('../services/googleNews'),
  logger = require('../logger'),
  schedule = require('node-schedule'),
  { GoogleNews } = require('../models');

const { SOURCES } = require('./constants');

const { getLinks } = require('./utils');

exports.getSources = (req, res) => res.send(SOURCES);

exports.getLastPubdate = (req, res, next) => {
  const { source, feed } = req.query;
  if (!source || source >= SOURCES.length) {
    return res.status(400).send('Source is missing or is too big');
  }
  logger.info(`Getting last date from ${SOURCES[source].name}...`);
  const feeds = getLinks(source, feed);
  return getNews(feeds)
    .then(response => res.send(response.items[0].pubDate))
    .catch(next);
};

exports.getNews = (req, res, next) => {
  const { source, feed } = req.query;
  if (!source || source >= SOURCES.length) {
    return res.status(400).send('Source is missing or is too big');
  }
  logger.info(`Getting news from ${SOURCES[source].name}...`);
  const feeds = getLinks(source, feed);
  return getNews(feeds)
    .then(response => {
      let ans = [];
      // eslint-disable-next-line array-callback-return
      response.items.map(item => {
        const { title, link, pubDate, content } = item;
        ans = [...ans, { title, link, pubDate, content }];
      });
      return res.send(ans);
    })
    .catch(next);
};

exports.getPeriodicGoogleNews = (req, res, next) => {
  schedule.scheduleJob('0 * * * *', () => {
    logger.info('Getting Google news...');
    return getNews([
      // eslint-disable-next-line max-len
      'https://news.google.com/rss/topics/CAAqKAgKIiJDQkFTRXdvSkwyMHZNREZqY0hsNUVnWmxjeTAwTVRrb0FBUAE?hl=es-419&gl=AR&ceid=AR%3Aes-419'
    ])
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
