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
  // TODO: Agregar tabla de stopwords
  // TODO: Para el endpoint de entidades, agregar parametros en la busqueda como rango de fechas, etc
  app.get('/cantidad-de-noticias', getNewsQuantitySQL);
  app.get('/heatmap', heatmapSQL);
  app.get('/busqueda', searchSQL);
  app.get('/wordtree', wordtree);
  app.get('/nube-de-palabras', wordcloud);
  app.get('/tendencias', trends);
  // app.post('/google-news', getPeriodicGoogleNews);
  // app.get('/google-news', getGoogleNews);
};
