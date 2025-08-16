const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbPostgresSQL');

const Medicine = sequelize.define('Medicine', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'medicines',
  timestamps: true,
});

module.exports = Medicine;
