const Parser = require('rss-parser');
const parser = new Parser();

exports.getNews = async links => {
  let items = [];
  for (let i = 0; i < links.length; i++) {
    const newItems = await parser.parseURL(links[i]);
    items = [...items, ...newItems.items];
  }
  return { items };
};
