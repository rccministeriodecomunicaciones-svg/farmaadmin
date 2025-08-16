const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbPostgresSQL');
const Producto = require('../models/productModel'); // ⚠️ Asegúrate de que la ruta sea correcta

const Carrito = sequelize.define('Carrito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productoId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  farmaciaId: {  // ✅ Nuevo campo
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente'
  }
}, {
  tableName: 'Carritos',
  timestamps: true
});

// ✅ Asociación activa inmediatamente
const Usuario = require('../models/userModel'); // ⚠️ Asegúrate de importar el modelo real
const Farmacia = require('../models/FarmaModel')


Carrito.belongsTo(Producto, { foreignKey: 'productoId' });
Carrito.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Carrito.belongsTo(Farmacia, { foreignKey: 'farmaciaId' });



module.exports = Carrito;
