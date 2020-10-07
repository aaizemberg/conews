/* eslint-disable new-cap */
'use strict';
module.exports = (sequelize, Sequelize) => {
  const CoreNews = sequelize.define(
    'CoreNews',
    {
      proxylogicaldeletemodel_ptr_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      summary: {
        type: Sequelize.STRING,
        allowNull: false
      },
      url: {
        type: Sequelize.STRING(4096),
        allowNull: false
      },
      source_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      content: {
        type: Sequelize.STRING,
        allowNull: true
      },
      media: {
        type: Sequelize.STRING,
        allowNull: true
      },
      publication_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true
      }
    },
    {}
  );
  CoreNews.associate = () => {
    // associations can be defined here
  };
  return CoreNews;
};
