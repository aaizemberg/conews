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
        // type: Sequelize.ENUM,
        // values: ['MISC', 'PER', 'LOC', 'ORG']
        type: Sequelize.INTEGER,
        allowNull: false
      },
      field: {
        // type: Sequelize.ENUM,
        // values: ['TITLE', 'SUMMARY', 'CONTENT']
        type: Sequelize.INTEGER,
        allowNull: false
      },
      program: {
        // type: Sequelize.ENUM,
        // values: ['NERD_API', 'SPACY_1', 'SPACY_2', 'SPACY_3']
        type: Sequelize.INTEGER,
        allowNull: false
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
