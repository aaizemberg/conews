const { Sources } = require('../models'),
  { SOURCES } = require('./constants'),
  { success } = require('./utils');

exports.insertSources = async (req, res) => {
  for (let i = 0; i < SOURCES.length; i++) {
    const { name, url } = SOURCES[i];
    await Sources.create({
      name,
      url
    });
  }
  return res.send('OK, Sources inserted');
};

exports.getSources = (req, res) => Sources.findAll().then(sources => res.send(success(sources)));
