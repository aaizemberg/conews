'use strict';
module.exports = (sequelize, Sequelize) => {
  const Feeds = sequelize.define(
    'Feeds',
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sourceId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      lastUpdate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    },
    {}
  );
  Feeds.associate = models => {
    Feeds.belongsTo(models.Sources, {
      foreignKey: 'sourceId',
      as: 'source'
    });
    Feeds.hasMany(models.News, {
      foreignKey: 'feedId',
      as: 'news'
    });
  };
  return Feeds;
};
