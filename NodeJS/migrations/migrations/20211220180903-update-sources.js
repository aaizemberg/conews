'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Sources', 'rss', {
      type: Sequelize.STRING,
      allowNull: true
    }),
  down: queryInterface => queryInterface.removeColumn('Sources', 'rss')
};
