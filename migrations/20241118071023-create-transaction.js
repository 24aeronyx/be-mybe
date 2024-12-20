'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transaction', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      profile_id: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.ENUM('income', 'outcome'),
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false, // Wajib diisi
      },
      category: {
        type: Sequelize.ENUM(
          'Salary', 'Investment', 'Gift', 'Freelance', // Kategori income
          'Food', 'Transportation', 'Entertainment', 'Utilities' // Kategori outcome
        ),
        allowNull: false, // Wajib diisi
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      transaction_date: {
        type: Sequelize.DATE,
      },
      description: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transaction');
  },
};
