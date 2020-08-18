const jwt = require('jsonwebtoken');
const logger = require('../logger');
const bcrypt = require('bcryptjs');
const config = require('../../config');

exports.signJWT = payload => {
  logger.info('Signing JWT...');
  return jwt.sign(payload, config.common.privateKey, {
    algorithm: 'HS256',
    expiresIn: config.common.tokenExpirationTime
  });
};

exports.compare = (password, encodedPassword) => bcrypt.compare(password, encodedPassword);
