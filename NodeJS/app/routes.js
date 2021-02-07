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
  { insertFeeds, getFeeds } = require('./controllers/feeds'),
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
  app.get('/news', getNews);
  app.get('/news-last-pubDate', getLastPubdate);
  app.post('/insert-sources', insertSources);
  app.post('/insert-feeds', insertFeeds);
  app.get('/periodic-news', getPeriodicNews);
  app.get('/medios', getSources);
  app.get('/feeds', getFeeds);
  // TODO: En tendencias, agregar parametro debug true y en ese caso que devuelva las cantidades y no los porcentajes
  // TODO: Para cada RSS, agregar la ultima vez que se obtuvieron noticias del mismo
  // TODO: Armar en observable algunos graficos para verificar el correcto funcionamiento de la API. Para cada endpoint poner un par de visualizaciones
  app.get('/cantidad-de-noticias', getNewsQuantitySQL);
  app.get('/heatmap', heatmapSQL);
  app.get('/busqueda', searchSQL);
  app.get('/wordtree', wordtree);
  app.get('/nube-de-palabras', wordcloud);
  app.get('/tendencias', trends);
  app.post('/insert-stopword', insertStopword);
  // app.post('/google-news', getPeriodicGoogleNews);
  // app.get('/google-news', getGoogleNews);
};
