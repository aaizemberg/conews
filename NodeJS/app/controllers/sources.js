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

exports.getSources = (req, res, next) =>
  Sources.findAll().then(sources =>
    res.send(success(sources.map(source => ({ id: source.id, source: source.name })))).catch(next)
  );
