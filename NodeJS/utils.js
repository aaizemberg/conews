const { Sources } = require('./app/models'),
  { SOURCES } = require('./app/controllers/constants');

exports.insertSources = async () => {
  for (let i = 0; i < SOURCES.length; i++) {
    const { name, url } = SOURCES[i];
    await Sources.findOrCreate({
      where: {
        name,
        url
      }
    });
  }
};
