const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbPostgresSQL');
const Supplier = require('./proveedoresModel');

const PurchaseOrder = sequelize.define('PurchaseOrder', {
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
  },
}, {
  tableName: 'purchase_orders',
  timestamps: true,
});

// Relaciones
PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplierId', as: 'supplier' });

module.exports = PurchaseOrder;
