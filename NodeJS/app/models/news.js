/* eslint-disable new-cap */
'use strict';
module.exports = (sequelize, Sequelize) => {
  const News = sequelize.define(
    'News',
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      summary: {
        type: Sequelize.STRING(1000),
        allowNull: true
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.STRING(1000),
        allowNull: true
      },
      publicationDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      sourceId: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    },
    {}
  );
  News.associate = models => {
    News.belongsTo(models.Sources, {
      foreignKey: 'sourceId',
      as: 'source'
    });
    News.belongsToMany(models.Entities, {
      through: 'EntitiesNews',
      as: 'entities',
      foreignKey: 'newId'
    });
  };
  return News;
};
