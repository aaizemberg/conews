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
  // app.get('/news', getNews);
  // app.get('/news-last-pubDate', getLastPubdate);
  app.post('/insert-sources', insertSources);
  app.get('/periodic-news', getPeriodicNews);
  app.get('/medios', getSources);
  // TODO: Hacer el parsing por aca: https://news.google.com/rss/search?q=https://www.clarin.com/&hl=es-419&gl=AR&ceid=AR:es-419
  // TODO: Agregar https://www.ole.com.ar/ , https://www.telam.com.ar/ , https://www.elterritorio.com.ar/ , Ellitoral.com , Diariopanorama.com
  // TODO: Armar un swagger para la documentacion
  // TODO: Modificar documentacion final para entregar
  // TODO: En el title que viene con -, sacarle la ultima parte que es el nombre del medio para que no quede en el title (hacer el split)
  // TODO: LO HACE OLIVER. Armar en observable algunos graficos para verificar el correcto funcionamiento de la API. Para cada endpoint poner un par de visualizaciones
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
