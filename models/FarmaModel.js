const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbPostgresSQL');
const Producto = require('./productModel');


const Farmacia = sequelize.define('Farmacia', {
    nombre: 
    { type: DataTypes.STRING, allowNull: false },
    direccion: DataTypes.STRING,
    telefono: DataTypes.STRING,
    representante: DataTypes.STRING,
    email: DataTypes.STRING

},{
    tableName: 'farmacias',
    timestamps: true
});




// 👇 Define la relación entre Farmacia y Producto
Farmacia.hasMany(Producto, { foreignKey: 'farmaciaId' });
Producto.belongsTo(Farmacia, { foreignKey: 'farmaciaId' });



module.exports = Farmacia;


