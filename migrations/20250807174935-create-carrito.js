'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Carritos', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      productoId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pendiente'
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Carritos');
  }
};
