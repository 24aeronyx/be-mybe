'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Profile, {
        foreignKey: 'profile_id',
        as: 'profile',
      });
    }
  }
  Transaction.init(
    {
      profile_id: DataTypes.INTEGER,
      type: DataTypes.ENUM('income', 'outcome'),
      category: DataTypes.ENUM(
        'Salary', 'Investment', 'Gift', 'Freelance', // Kategori income
        'Food', 'Transportation', 'Entertainment', 'Utilities' // Kategori outcome
      ),
      title: DataTypes.STRING,
      amount: DataTypes.FLOAT,
      transaction_date: DataTypes.DATE,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Transaction',
      freezeTableName: true,
    }
  );
  return Transaction;
};
