const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbPostgresSQL');

const Supplier = sequelize.define('Supplier', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contactName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
}, {
  tableName: 'suppliers',
  schema: 'farma',
  timestamps: true,
});

module.exports = Supplier;
