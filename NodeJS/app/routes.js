const { getPeriodicGoogleNews, getGoogleNews } = require('./controllers/googleNews');

exports.init = app => {
  app.post('/google-news', getPeriodicGoogleNews);
  app.get('/google-news', getGoogleNews);
};
