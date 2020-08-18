/* eslint-disable new-cap */
'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('GoogleNews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      link: {
        type: Sequelize.STRING(4096)
      },
      source: {
        type: Sequelize.STRING
      },
      pubDate: {
        defaultValue: null,
        type: Sequelize.DATE
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
  down: queryInterface => queryInterface.dropTable('GoogleNews')
};
