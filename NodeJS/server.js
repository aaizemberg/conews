const app = require('./app'),
  migrationsManager = require('./migrations'),
  config = require('./config'),
  logger = require('./app/logger'),
  { insertSources } = require('./utils'),
  { getPeriodicNews, extractPeriodicEntities } = require('./app/controllers/news');

const port = config.common.api.port || 8080;

Promise.resolve()
  .then(() => migrationsManager.check())
  .then(async () => {
    app.listen(port);
    await insertSources();
    await getPeriodicNews();
    await extractPeriodicEntities();
    logger.info(`Listening on port: ${port}`);
  })
  .catch(logger.error);
