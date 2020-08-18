const { albumUser } = require('../models'),
  { alreadyBoughtAlbumError, didntBuyAlbumError, databaseError } = require('../errors'),
  logger = require('../logger');

const userBoughtAlbum = req => {
  logger.info('Searching album...');
  return albumUser
    .findOne({
      where: {
        albumId: req.params.id,
        userId: req.user.id
      }
    })
    .catch(e => {
      throw databaseError(e.message);
    });
};

exports.checkIfUserDidntBuyAlbum = (req, res, next) => {
  logger.info('Checking if did not buy album...');
  return userBoughtAlbum(req, res, next)
    .then(response => {
      if (response) {
        throw alreadyBoughtAlbumError('You have already bought that album');
      }
      return next();
    })
    .catch(next);
};

exports.checkIfUserBoughtAlbum = (req, res, next) => {
  logger.info('Checking if bought album...');
  return userBoughtAlbum(req, res, next)
    .then(response => {
      if (!response) {
        throw didntBuyAlbumError('You did not buy that album');
      }
      return next();
    })
    .catch(next);
};
