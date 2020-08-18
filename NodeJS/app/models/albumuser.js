'use strict';
module.exports = (sequelize, Sequelize) => {
  const AlbumUser = sequelize.define(
    'albumUser',
    {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true },
      albumId: { type: Sequelize.INTEGER, allowNull: false, field: 'album_id' },
      albumTitle: { type: Sequelize.STRING, allowNull: false, field: 'album_title' },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        field: 'user_id'
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['album_id', 'user_id']
        }
      ],
      tableName: 'album_users'
    }
  );
  AlbumUser.associate = models => {
    AlbumUser.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'album_users'
    });
  };
  return AlbumUser;
};
