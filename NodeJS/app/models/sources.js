'use strict';
module.exports = (sequelize, Sequelize) => {
  const Sources = sequelize.define(
    'Sources',
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {}
  );
  Sources.associate = models => {
    Sources.hasMany(models.Feeds, {
      foreignKey: 'sourceId',
      as: 'feeds'
    });
  };
  return Sources;
};
