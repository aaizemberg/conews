/* eslint-disable new-cap */
'use strict';
module.exports = (sequelize, Sequelize) => {
  const News = sequelize.define(
    'News',
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
      title: {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.STRING(1000),
        allowNull: true
      },
      entitiesCalculated: { type: Sequelize.BOOLEAN, defaultValue: false },
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
