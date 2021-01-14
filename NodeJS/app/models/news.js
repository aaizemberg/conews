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
        type: Sequelize.STRING,
        allowNull: false
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content: {
        type: Sequelize.STRING,
        allowNull: true
      },
      publicationDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      feedId: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    },
    {}
  );
  News.associate = models => {
    News.belongsTo(models.Feeds, {
      foreignKey: 'feedId',
      as: 'feed'
    });
    News.belongsToMany(models.Entities, {
      through: 'EntitiesNews',
      as: 'entities',
      foreignKey: 'newId'
    });
  };
  return News;
};
