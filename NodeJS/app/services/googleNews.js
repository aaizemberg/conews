const Parser = require('rss-parser');
const parser = new Parser();

exports.getNews = () =>
  parser.parseURL(
    // eslint-disable-next-line max-len
    'https://news.google.com/rss/topics/CAAqKAgKIiJDQkFTRXdvSkwyMHZNREZqY0hsNUVnWmxjeTAwTVRrb0FBUAE?hl=es-419&gl=AR&ceid=AR%3Aes-419'
  );
