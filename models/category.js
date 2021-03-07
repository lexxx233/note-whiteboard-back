const {
  Model,
} = require('sequelize');

module.exports = (Sequelize, DataTypes) => {
  const Category = Sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  }, {
    tableName: 'categories',
    timestamps: true,
  });

  Category.associate = (models) => {
    Category.hasMany(models.Note, {
      as: 'taskIds',
      foreignKey: { foreignKey: 'columnid' },
    });
    Category.belongsTo(models.User, {
      foreignKey: { name: 'id', allowNull: false },
      as: 'User',
      onDelete: 'CASCADE',
    });
  };

  return Category;
};
