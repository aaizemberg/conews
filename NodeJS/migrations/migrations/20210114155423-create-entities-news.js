'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('EntitiesNews', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      entityId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      newId: {
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
  down: queryInterface => queryInterface.dropTable('EntitiesNews')
};
