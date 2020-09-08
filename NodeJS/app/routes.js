const {
  // getPeriodicGoogleNews,
  getNews,
  // getInfobaeNews,
  // getClarinNews,
  // getLaNacionNews,
  // getGoogleNews,
  getLastPubdate,
  getSources
} = require('./controllers/googleNews');

exports.init = app => {
  app.get('/', (req, res) => res.send('Welcome to Heroku'));
  app.get('/news', getNews);
  app.get('/news-last-pubDate', getLastPubdate);
  app.get('/sources', getSources);
  // app.post('/google-news', getPeriodicGoogleNews);
  // app.get('/google-news', getGoogleNews);
};
