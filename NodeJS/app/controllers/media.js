const logger = require('../logger');

exports.uploadVideo = (req, res) => {
  logger.info('Uploading video...');
  return res.send('OK');
};
