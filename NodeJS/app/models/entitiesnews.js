'use strict';
module.exports = (sequelize, Sequelize) => {
  const EntitiesNews = sequelize.define(
    'EntitiesNews',
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
      entityId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      newId: {
        type: Sequelize.INTEGER,
        allowNull: true
      }
    },
    {}
  );
  EntitiesNews.associate = () => {
    // associations can be defined here
  };
  return EntitiesNews;
};
