'use strict';
module.exports = (sequelize, Sequelize) => {
  const Sources = sequelize.define(
    'Sources',
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rss: {
        type: Sequelize.STRING,
        allowNull: true
      },
      lastUpdate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    },
    {}
  );
  Sources.associate = models => {
    Sources.hasMany(models.News, {
      foreignKey: 'sourceId',
      as: 'news'
    });
  };
  return Sources;
};
