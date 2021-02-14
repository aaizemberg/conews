/* eslint-disable max-len */
const { insertSources, getSources } = require('./controllers/sources'),
  {
    getPeriodicNews,
    getNewsQuantitySQL,
    heatmapSQL,
    searchSQL,
    wordtree,
    wordcloud,
    trends,
    insertStopword
  } = require('./controllers/news');

exports.init = app => {
  app.get('/', (req, res) => res.send('Welcome to Heroku'));
  app.post('/insert-sources', insertSources);
  app.get('/periodic-news', getPeriodicNews);
  app.get('/medios', getSources);
  // Resuelto: Cambiar estructura modelos sacando feeds, agregando mas medios
  // TODO: Armar un swagger para la documentacion
  // TODO: Modificar documentacion final para entregar
  // TODO: LO HACE OLIVER. Armar en observable algunos graficos para verificar el correcto funcionamiento de la API. Para cada endpoint poner un par de visualizaciones
  app.get('/cantidad-de-noticias', getNewsQuantitySQL);
  app.get('/heatmap', heatmapSQL);
  app.get('/busqueda', searchSQL);
  app.get('/wordtree', wordtree);
  app.get('/nube-de-palabras', wordcloud);
  app.get('/tendencias', trends);
  app.post('/insert-stopword', insertStopword);
};
