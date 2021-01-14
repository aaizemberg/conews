const { Sources } = require('../models'),
  { SOURCES } = require('./constants');

exports.insertSources = async (req, res) => {
  for (let i = 0; i < SOURCES.length; i++) {
    const sourceName = SOURCES[i].name;
    await Sources.create({
      name: sourceName
    });
  }
  return res.send('OK, Sources inserted');
};
