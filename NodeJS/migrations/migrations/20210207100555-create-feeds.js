'use strict';
module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Feeds', 'lastUpdate', {
      type: Sequelize.DATEONLY,
      allowNull: true
    }),
  down: queryInterface => queryInterface.removeColumn('Feeds', 'lastUpdate')
};
