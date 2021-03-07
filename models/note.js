const {
  Model,
} = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} Sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 */
module.exports = (Sequelize, DataTypes) => {
  	const Note = Sequelize.define('Note', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      defaultValue: '',
      allowNull: false,
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'CASCADE',

    },
  }, {
    tableName: 'notes',
    timestamps: true,
  });

  Note.associate = (models) => {
    Note.belongsTo(models.Category, {
      foreignKey: { name: 'id', allowNull: false },
      onDelete: 'CASCADE',
    });
  };

  return Note;
};
