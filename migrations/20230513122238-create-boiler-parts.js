'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BoilerParts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      boiler_manufacturer: { type: Sequelize.STRING },
      price: { type: Sequelize.INTEGER },
      parts_manufacturer: { type: Sequelize.STRING },
      vendor_code: { type: Sequelize.STRING },
      description: { type: Sequelize.STRING(2048) },
      images: { type: Sequelize.STRING(2048) },
      in_stock: { type: Sequelize.INTEGER },
      bestseller: { type: Sequelize.BOOLEAN },
      fresh: { type: Sequelize.BOOLEAN },
      popularity: { type: Sequelize.INTEGER },
      compatibiliti: { type: Sequelize.STRING(2048) },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BoilerParts');
  },
};
