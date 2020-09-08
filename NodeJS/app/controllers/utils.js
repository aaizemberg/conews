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
