// models/detalleOrdenModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbPostgresSQL');
const Orden = require('../models/orderModel');
const Producto = require('../models/productModel');


const DetalleOrden = sequelize.define('DetalleOrden', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ordenId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precioUnitario: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'DetalleOrdenes',
  timestamps: true
});

DetalleOrden.belongsTo(Orden, { foreignKey: 'ordenId' });
DetalleOrden.belongsTo(Producto, { foreignKey: 'productoId' });

module.exports = DetalleOrden;
