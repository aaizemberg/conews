const { Sources, Feeds } = require('../models'),
  { SOURCES } = require('./constants'),
  logger = require('../logger'),
  { success } = require('./utils');

exports.insertFeeds = async (req, res) => {
  for (let i = 0; i < SOURCES.length; i++) {
    const sourceName = SOURCES[i].name;
    const source = await Sources.findOne({
      where: {
        name: sourceName
      }
    });
    logger.info(source.id);
    const { feeds } = SOURCES[i];
    for (let j = 0; j < feeds.length; j++) {
      const { title, link } = feeds[j];
      await Feeds.create({
        title,
        url: link,
        sourceId: source.id
      });
    }
  }
  return res.send('OK, Feeds inserted');
};

exports.getFeeds = (req, res, next) =>
  Feeds.findAll()
    .then(feeds => res.send(success(feeds)))
    .catch(next);
