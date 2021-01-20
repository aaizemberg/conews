'use strict';
module.exports = (sequelize, Sequelize) => {
  const Entities = sequelize.define(
    'Entities',
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        // type: Sequelize.ENUM,
        // values: ['MISC', 'PER', 'LOC', 'ORG']
        type: Sequelize.STRING,
        allowNull: false
      },
      field: {
        // type: Sequelize.ENUM,
        // values: ['TITLE', 'SUMMARY', 'CONTENT']
        type: Sequelize.STRING,
        allowNull: false
      },
      program: {
        // type: Sequelize.ENUM,
        // values: ['NERD_API', 'SPACY_1', 'SPACY_2', 'SPACY_3']
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {}
  );
  Entities.associate = models => {
    Entities.belongsToMany(models.News, {
      through: 'EntitiesNews',
      as: 'news',
      foreignKey: 'entityId'
    });
  };
  return Entities;
};
