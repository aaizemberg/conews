const { Sources } = require('./app/models'),
  { SOURCES } = require('./app/controllers/constants'),
  logger = require('./app/logger');

exports.insertSources = async () => {
  for (let i = 0; i < SOURCES.length; i++) {
    const { name, url, rss } = SOURCES[i];
    try {
      const source = await Sources.findOne({
        where: {
          name
        }
      });
      if (source) {
        await source.update({
          rss
        });
      } else {
        await Sources.create({
          name,
          url,
          rss
        });
      }
    } catch (error) {
      logger.info(error);
    }
  }
};
