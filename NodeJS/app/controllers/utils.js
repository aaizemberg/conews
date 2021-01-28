const jwt = require('jsonwebtoken');
const logger = require('../logger');
const bcrypt = require('bcryptjs');
const config = require('../../config');
const { SOURCES } = require('./constants');

exports.signJWT = payload => {
  logger.info('Signing JWT...');
  return jwt.sign(payload, config.common.privateKey, {
    algorithm: 'HS256',
    expiresIn: config.common.tokenExpirationTime
  });
};

exports.compare = (password, encodedPassword) => bcrypt.compare(password, encodedPassword);

exports.getLinks = (source, feed) => {
  let feeds = [];
  if (feed && feed < SOURCES[source].feeds.length) {
    feeds = [SOURCES[source].feeds[feed].link];
  } else {
    // eslint-disable-next-line array-callback-return
    SOURCES[source].feeds.map(item => {
      feeds = [...feeds, item.link];
    });
  }
  return feeds;
};

exports.success = data => ({
  status: 'success',
  data
});

exports.getDate = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
};

exports.getCurrentDate = () => {
  const today = new Date();
  let dd = today.getDate();

  let mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();
  if (dd < 10) {
    dd = `0${dd}`;
  }

  if (mm < 10) {
    mm = `0${mm}`;
  }
  return `${yyyy}-${mm}-${dd}`;
};
