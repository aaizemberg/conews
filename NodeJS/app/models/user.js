'use strict';
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
      email: { type: Sequelize.STRING, allowNull: true },
      surname: { type: Sequelize.STRING, allowNull: true },
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      admin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      signoutDatetime: { type: Sequelize.DATE, field: 'signout_datetime', allowNull: true }
    },
    {}
  );
  User.associate = () => {
    // associations can be defined here
  };
  return User;
};
