// src/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(
  process.env.DATABASE, 'fescobar', process.env.PASSWORD, 
  {
  host: process.env.SERVER, // Nombre servidor
  dialect: 'postgres',
  logging: false, // Configura en true si deseas ver las consultas SQL en la consola
});


sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión establecida con éxito.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

module.exports = sequelize;
