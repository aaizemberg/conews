const rp = require('request-promise');

exports.listAlbums = () => rp({ uri: `${process.env.JSONPLACEHOLDER_BASE_URL}/albums`, json: true });
exports.listPhotos = req =>
  rp({ uri: `${process.env.JSONPLACEHOLDER_BASE_URL}/photos?albumId=${req.params.id}`, json: true });

exports.findAlbumsById = id =>
  rp({ uri: `${process.env.JSONPLACEHOLDER_BASE_URL}/albums/${id}`, json: true });
