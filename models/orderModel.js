// models/ordenModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbPostgresSQL');
const Usuario = require('../models/userModel');

const Orden = sequelize.define('Orden', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente' // pendiente, pagada, enviada, cancelada
  }
}, {
  tableName: 'Ordenes',
  schema: 'farma',
  timestamps: true
});

Orden.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });


module.exports = Orden;
