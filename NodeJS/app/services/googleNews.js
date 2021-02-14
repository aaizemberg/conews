const Parser = require('rss-parser');
const parser = new Parser();
const { URL_PREFIX, URL_SUFFIX } = require('./constants');

exports.getNews = async links => {
  let items = [];
  for (let i = 0; i < links.length; i++) {
    const newItems = await parser.parseURL(`${URL_PREFIX}${links[i]}${URL_SUFFIX}`);
    items = [...items, ...newItems.items];
  }
  return { items };
};
