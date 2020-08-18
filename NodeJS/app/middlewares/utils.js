/* eslint-disable indent */
const { User } = require('../models'),
  { notLoggedError, signOutError } = require('../errors'),
  logger = require('../logger'),
  jwt = require('jsonwebtoken'),
  moment = require('moment'),
  { TOKEN_START } = require('../constants'),
  config = require('../../config');

const getNotLoggedError = admin =>
  notLoggedError(admin ? 'You have to be logged in as an admin user' : "You don't have access, please login");

exports.verifyJWT = (req, authorizationToken, admin) => {
  logger.info('Verifying JWT...');
  return new Promise((resolve, reject) => {
    jwt.verify(authorizationToken, config.common.privateKey, (err, decoded) => {
      if (decoded && decoded.email && decoded.password && (!admin || decoded.admin)) {
        logger.info('Searching user...');
        return User.findOne({
          where: {
            email: decoded.email,
            password: decoded.password
          }
        })
          .then(user => {
            if (user.signoutDatetime && moment(decoded.issuedAt).isSameOrBefore(user.signoutDatetime)) {
              return reject(signOutError('You signed out'));
            }
            logger.info('Search finished.');
            req.user = user;
            return user ? resolve() : reject(getNotLoggedError(admin));
          })
          .catch(reject);
      }
      return reject(getNotLoggedError(admin));
    });
  });
};

exports.checkIfUserIsLogged = (req, res, next, admin) => {
  let authorizationToken = req.headers.authorization;
  if (authorizationToken && authorizationToken.startsWith(TOKEN_START)) {
    authorizationToken = authorizationToken.substring(TOKEN_START.length);
    return exports
      .verifyJWT(req, authorizationToken, admin)
      .then(() => next())
      .catch(next);
  }
  return next(getNotLoggedError(admin));
};
