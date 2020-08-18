const bcrypt = require('bcryptjs');

exports.userMapper = body =>
  bcrypt.hash(body.password, 10).then(hashedPassword => ({
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: hashedPassword,
    admin: body.admin
  }));

exports.userWithDateMapper = user => ({ ...user.dataValues, issuedAt: Date() });
