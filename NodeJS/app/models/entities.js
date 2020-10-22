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
      }
    },
    {}
  );
  Entities.associate = () => {
    // associations can be defined here
  };
  return Entities;
};
