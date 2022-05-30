/* eslint-disable max-len */
const { getSources } = require('./controllers/sources'),
  {
    getNewsQuantitySQL,
    heatmapSQL,
    searchSQL,
    wordtree,
    wordcloud,
    trends,
    insertStopword,
    insertSource,
    getStopwords,
    deleteStopword,
    deleteSource,
    getEntities
  } = require('./controllers/news'),
  { login, addUser } = require('./controllers/user'),
  { validateSchema } = require('./middlewares/common'),
  { checkIfUserIsLogged } = require('./middlewares/user'),
  schemas = require('./schemas'),
  { DESCRIPTOR, API_BASE_URL } = require('./constants');

exports.init = app => {
  app.get('/', (req, res) => res.send(DESCRIPTOR));
  // app.post('/insert-sources', [checkIfUserIsLogged], insertSources);
  // app.get('/periodic-news', getPeriodicNews);
  app.get(`${API_BASE_URL}/cantidad-de-noticias`, getNewsQuantitySQL);
  app.get(`${API_BASE_URL}/heatmap`, heatmapSQL);
  app.get(`${API_BASE_URL}/busqueda`, searchSQL);
  app.get(`${API_BASE_URL}/wordtree`, wordtree);
  app.get(`${API_BASE_URL}/nube-de-palabras`, wordcloud);
  app.get(`${API_BASE_URL}/tendencias`, trends);
  app.post(`${API_BASE_URL}/insert-stopword`, [checkIfUserIsLogged], insertStopword);
  app.get(`${API_BASE_URL}/stopwords`, [checkIfUserIsLogged], getStopwords);
  app.delete(`${API_BASE_URL}/stopword`, [checkIfUserIsLogged], deleteStopword);
  app.post(`${API_BASE_URL}/insert-medio`, [checkIfUserIsLogged], insertSource);
  app.get(`${API_BASE_URL}/medios`, getSources);
  app.delete(`${API_BASE_URL}/medio`, [checkIfUserIsLogged], deleteSource);
  app.post(`${API_BASE_URL}/login`, [validateSchema(schemas.userSignIn)], login);
  app.post(`${API_BASE_URL}/user`, [validateSchema(schemas.userSignUp)], addUser);
  app.get(`${API_BASE_URL}/entidades`, getEntities);
};
