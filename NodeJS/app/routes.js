/* eslint-disable max-len */
const { getSources } = require('./controllers/sources'),
  {
    getNewsQuantitySQL,
    heatmapSQL,
    searchSQL,
    wordtree,
    wordcloud,
    trends,
    insertStopword
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
  app.get(`${API_BASE_URL}/medios`, getSources);
  // Resuelto: Agregar roles de usuarios admins para que puedan acceder a los post, y que puedan crear nuevos usuarios admin.
  // Resuelto: En noticias agregar columna booleana para saber si ya se calcularon las entidades, es una marquita que despues cambia oliver
  // TODO: Subir el proyecto a la maquina del ITBA para ir viendo como funciona
  // TODO: Modificar documentacion final para entregar
  app.get(`${API_BASE_URL}/cantidad-de-noticias`, getNewsQuantitySQL);
  app.get(`${API_BASE_URL}/heatmap`, heatmapSQL);
  app.get(`${API_BASE_URL}/busqueda`, searchSQL);
  app.get(`${API_BASE_URL}/wordtree`, wordtree);
  app.get(`${API_BASE_URL}/nube-de-palabras`, wordcloud);
  app.get(`${API_BASE_URL}/tendencias`, trends);
  app.post(`${API_BASE_URL}/insert-stopword`, [checkIfUserIsLogged], insertStopword);
  app.post(`${API_BASE_URL}/login`, [validateSchema(schemas.userSignIn)], login);
  app.post(`${API_BASE_URL}/user`, [validateSchema(schemas.userSignUp)], addUser);
};
