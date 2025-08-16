const {DataTypes} = require('sequelize')
const sequelize = require('../config/dbPostgresSQL')
const Farmacia = require('../models/FarmaModel')

const Producto  = sequelize.define('Producto', {
   nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  farmaciaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'productos',
  schema: 'farma',
  timestamps: false 
})






module.exports = Producto
