const project = require('../package.json');

exports.DESCRIPTOR = {
  contributors: project.contributors,
  description: project.description,
  name: project.name,
  version: 'v1',
  swagger: 'https://newsapi.it.itba.edu.ar/api/v1/swagger/'
};

exports.EMAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@wolox.com.ar$/;
exports.PASSWORD_REGEXP = /^[0-9a-zA-Z]+$/;
exports.PASSWORD_MIN_LENGTH = 8;

exports.EMAIL_REGEXP_ERROR = 'Email is not valid';
exports.PASSWORD_REGEXP_ERROR = 'Password must be alphanumeric';
exports.PASSWORD_MIN_LENGTH_ERROR = 'Password must be at least 8 chars long';

exports.TOKEN_START = 'Bearer ';

exports.API_BASE_URL = '/api/v1';
