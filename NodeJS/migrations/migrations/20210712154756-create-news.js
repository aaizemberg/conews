module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.changeColumn('News', 'publicationDate', {
        type: Sequelize.DATE,
        allowNull: true
      })
    ]),

  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.changeColumn('News', 'publicationDate', {
        type: Sequelize.DATEONLY,
        allowNull: true
      })
    ])
};
