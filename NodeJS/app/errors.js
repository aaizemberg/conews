const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.SIGNUP_ERROR = 'signup_error';
exports.signupError = message => internalError(message, exports.SIGNUP_ERROR);

exports.SIGNIN_ERROR = 'signin_error';
exports.signinError = message => internalError(message, exports.SIGNIN_ERROR);

exports.SCHEMA_ERROR = 'schema_error';
exports.schemaError = message => internalError(message, exports.SCHEMA_ERROR);

exports.NOT_LOGGED_ERROR = 'not_logged_error';
exports.notLoggedError = message => internalError(message, exports.NOT_LOGGED_ERROR);

exports.SIGNOUT_ERROR = 'signout_error';
exports.signOutError = message => internalError(message, exports.SIGNOUT_ERROR);

exports.ALREADY_BOUGHT_ALBUM_ERROR = 'already_bought_album_error';
exports.alreadyBoughtAlbumError = message => internalError(message, exports.ALREADY_BOUGHT_ALBUM_ERROR);

exports.DIDNT_BUY_ALBUM_ERROR = 'didnt_buy_album_error';
exports.didntBuyAlbumError = message => internalError(message, exports.DIDNT_BUY_ALBUM_ERROR);

exports.NOT_HAS_ACCESS_ERROR = 'not_has_access';
exports.notHasAccessError = message => internalError(message, exports.NOT_HAS_ACCESS_ERROR);
