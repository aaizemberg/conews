/* eslint-disable max-len */
const {
    // getPeriodicGoogleNews,
    getNews,
    // getInfobaeNews,
    // getClarinNews,
    // getLaNacionNews,
    // getGoogleNews,
    getLastPubdate
  } = require('./controllers/googleNews'),
  { insertSources, getSources } = require('./controllers/sources'),
  { insertFeeds } = require('./controllers/feeds'),
  {
    getPeriodicNews,
    getNewsQuantitySQL,
    heatmapSQL,
    searchSQL,
    wordtree,
    wordcloud,
    trends
  } = require('./controllers/news');

exports.init = app => {
  app.get('/', (req, res) => res.send('Welcome to Heroku'));
  app.get('/news', getNews);
  app.get('/news-last-pubDate', getLastPubdate);
  app.post('/insert-sources', insertSources);
  app.post('/insert-feeds', insertFeeds);
  app.get('/periodic-news', getPeriodicNews);
  app.get('/medios', getSources);
  // TODO: Agregar tabla de stopwords. Ademas para las stopwords, agregar que el usuario pueda pasarlo en la query
  // TODO: Para el endpoint de entidades, agregar parametros en la busqueda como rango de fechas, etc
  // TODO: Para todos los endpoints, podriamos hacer que si no le aclaro fechas, que me tire solamente las noticias del dia actual
  // Resuelto: En tendencias, agregar la cantidad de veces que aparece para hacer debugging. RESUELTO: en lugar de agregar el campo, comento el ultimo for y me muestra la cantidad
  app.get('/cantidad-de-noticias', getNewsQuantitySQL);
  app.get('/heatmap', heatmapSQL);
  app.get('/busqueda', searchSQL);
  app.get('/wordtree', wordtree);
  app.get('/nube-de-palabras', wordcloud);
  app.get('/tendencias', trends);
  // app.post('/google-news', getPeriodicGoogleNews);
  // app.get('/google-news', getGoogleNews);
};
