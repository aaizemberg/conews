const { User } = require('../models'),
  { signupError } = require('../errors'),
  { userMapper } = require('../mappers/user'),
  { serializeUser } = require('../serializers/user'),
  logger = require('../logger'),
  { sendEmail } = require('./utils');

exports.add = async (req, admin) => {
  const mappedUser = await userMapper({ ...req.body, admin });
  if (admin) {
    await User.upsert(mappedUser);
    return serializeUser(mappedUser);
  }
  logger.info('Searching user...');
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  });
  if (user) {
    throw signupError('Email is already in use');
  }
  logger.info('Email is new.');
  sendEmail(mappedUser);
  logger.info('Creating user...');
  const createdUser = await User.create(mappedUser);
  return serializeUser(createdUser);
};
