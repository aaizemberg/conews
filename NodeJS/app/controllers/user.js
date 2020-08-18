const { User } = require('../models'),
  { signinError } = require('../errors'),
  { add: addInteractor } = require('../interactors/user'),
  { userWithDateMapper } = require('../mappers/user'),
  { serializeUser } = require('../serializers/user'),
  logger = require('../logger'),
  { signJWT, compare } = require('./utils');

const { TOKEN_START } = require('../constants');

exports.list = (req, res, next) => {
  User.findAndCountAll({ limit: req.query.limit, offset: req.skip, order: [['id', 'ASC']] })
    .then(results => {
      const itemCount = results.count;
      const pageCount = Math.ceil(results.count / req.query.limit);
      return res.send({
        page: results.rows.map(user => serializeUser(user)),
        currentPage: req.query.page,
        totalPages: pageCount,
        totalItems: itemCount
      });
    })
    .catch(next);
};

const add = (req, res, next, admin) => {
  logger.info('Calling to interactor...');
  return addInteractor(req, admin)
    .then(response => res.status(201).send(response))
    .catch(next);
};

exports.addUser = (req, res, next) => add(req, res, next, false);

exports.addAdmin = (req, res, next) => add(req, res, next, true);

exports.login = (req, res, next) => {
  logger.info('Searching user...');
  return User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(user => {
      if (!user) {
        throw signinError('Email is not registered in the system');
      }

      return compare(req.body.password, user.password).then(passwordIsFine => {
        if (passwordIsFine) {
          logger.info('Logged in');
          const token = signJWT(userWithDateMapper(user));
          return res.set('Authorization', `${TOKEN_START} ${token}`).send('Logged in');
        }
        throw signinError('Email or password is incorrect');
      });
    })
    .catch(next);
};

exports.invalidateSessions = (req, res, next) => {
  logger.info('Searching user...');
  return User.findById(req.user.id)
    .then(user => {
      logger.info('Updating user...');
      return user
        .update({
          signoutDatetime: Date()
        })
        .then(() => res.send('OK'));
    })
    .catch(next);
};
