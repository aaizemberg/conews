/* eslint-disable new-cap */
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('News', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
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
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }),
  down: queryInterface => queryInterface.dropTable('News')
};
