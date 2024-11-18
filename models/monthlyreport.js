'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MonthlyReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MonthlyReport.init({
    profile_id: DataTypes.INTEGER,
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    total_income: DataTypes.FLOAT,
    total_outcome: DataTypes.FLOAT,
    balance: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'MonthlyReport',
  });
  return MonthlyReport;
};