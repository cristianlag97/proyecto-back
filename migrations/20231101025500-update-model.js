'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const enumType = queryInterface.sequelize.Sequelize.ENUM('asignado', 'sin_asignar');

    // Modifica la columna status en la tabla Pcs para utilizar el tipo ENUM definido
    await queryInterface.changeColumn('Pcs', 'status', {
      type: enumType,
      defaultValue: 'sin_asignar',
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('Pcs', 'status', {
      type: Sequelize.STRING, // Reemplaza con el tipo original de la columna
      defaultValue: 'sin_asignar',
      allowNull: false,
    });
  }
};
