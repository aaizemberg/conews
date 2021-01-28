'use strict';
module.exports = (sequelize, Sequelize) => {
  const Stopwords = sequelize.define(
    'Stopwords',
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
      word: {
        type: Sequelize.STRING,
        allowNull: false
      }
    },
    {}
  );
  Stopwords.associate = () => {
    // associations can be defined here
  };
  return Stopwords;
};
