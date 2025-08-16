// models/associations.js
const Farmacia = require('./farmaciaModel');
const Producto = require('./productModel');

Farmacia.hasMany(Producto, { foreignKey: 'farmaciaId' });
Producto.belongsTo(Farmacia, { foreignKey: 'farmaciaId' });

module.exports = { Farmacia, Producto };
