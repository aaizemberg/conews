'use strict';
module.exports = (sequelize, Sequelize) => {
  const Entities = sequelize.define(
    'Entities',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM,
        values: ['MISC', 'PER', 'LOC', 'ORG']
      },
      coreNewId: {
        type: Sequelize.INTEGER
      }
    },
    {}
  );
  Entities.associate = () => {
    // associations can be defined here
  };
  return Entities;
};
