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
  // TODO: Agregar roles de usuarios admins para que puedan acceder a los post, y que puedan crear nuevos usuarios admin.
  // TODO: En noticias agregar columna booleana para saber si ya se calcularon las entidades, es una marquita que despues cambia oliver
  // TODO: Subir el proyecto a la maquina del ITBA para ir viendo como funciona
  // TODO: Modificar documentacion final para entregar
  app.get('/cantidad-de-noticias', getNewsQuantitySQL);
  app.get('/heatmap', heatmapSQL);
  app.get('/busqueda', searchSQL);
  app.get('/wordtree', wordtree);
  app.get('/nube-de-palabras', wordcloud);
  app.get('/tendencias', trends);
  app.post('/insert-stopword', insertStopword);
};
