'use strict';
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      surname: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      admin: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      signoutDatetime: { type: Sequelize.DATE, field: 'signout_datetime' }
    },
    {}
  );
  User.associate = models => {
    User.hasMany(models.albumUser, {
      foreignKey: 'user_id',
      as: 'album_users'
    });
  };
  return User;
};
