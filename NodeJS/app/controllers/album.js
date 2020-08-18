const {
    listAlbums: listAlbumsService,
    listPhotos: listPhotosService,
    findAlbumsById: findAlbumsByIdService
  } = require('../services/jsonplaceholder'),
  logger = require('../logger'),
  { albumUser } = require('../models'),
  { albumMapper } = require('../mappers/album');

exports.listAlbums = (req, res, next) => {
  logger.info('Listing albums...');
  return listAlbumsService()
    .then(response => res.send(response))
    .catch(next);
};

exports.listBoughtAlbums = (req, res, next) => {
  logger.info('Searching for bought albums');
  return albumUser
    .findAll({
      userId: req.params.id,
      attributes: ['id', 'album_id', 'album_title', 'user_id']
    })
    .then(response => {
      logger.info('Albums found');
      return res.send(response);
    })
    .catch(next);
};
exports.listPhotos = (req, res, next) => {
  logger.info('Listing photos...');
  return listPhotosService(req)
    .then(response => res.send(response))
    .catch(next);
};

exports.buyAlbum = (req, res, next) => {
  logger.info('Searching album...');
  return findAlbumsByIdService(req.params.id)
    .then(response => {
      logger.info('Creating album...');
      req.params.title = response.title;
      return albumUser
        .create(albumMapper({ ...req.params, user: req.user }))
        .then(() => res.status(201).send('OK, bought album'));
    })
    .catch(next);
};
