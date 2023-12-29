'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Pcs', 'referencia', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Pcs', 'modelo', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Laptops', 'referencia', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Laptops', 'modelo', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Pcs', 'referencia');
    await queryInterface.removeColumn('Pcs', 'modelo');
    await queryInterface.removeColumn('Laptops', 'referencia');
    await queryInterface.removeColumn('Laptops', 'modelo');
  }
};
