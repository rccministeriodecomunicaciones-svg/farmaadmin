const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbPostgresSQL'); // Importa la instancia de Sequelize
const bcrypt = require('bcrypt'); // Importa bcrypt para encriptar contraseñas

// Definir el modelo User
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  aproved: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'USERS',
  timestamps: true, // Desactiva los timestamps si no los estás usando
  hooks: {
    beforeCreate: async (user) => {
      const salt = await bcrypt.genSalt(10); // Genera el salt para el hash
      user.password = await bcrypt.hash(user.password, salt); // Encripta la contraseña
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) { // Solo encripta si la contraseña ha cambiado
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

module.exports = User;
