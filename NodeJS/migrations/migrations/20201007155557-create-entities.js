'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Entities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM,
        values: ['MISC', 'PER', 'LOC', 'ORG']
      },
      titularOrSummary: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      initialPosition: {
        type: Sequelize.INTEGER
      },
      endPosition: {
        type: Sequelize.INTEGER
      },
      programId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      coreNewId: {
        type: Sequelize.INTEGER
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
  down: queryInterface => queryInterface.dropTable('Entities')
};
