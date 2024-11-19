'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      // Menambahkan asosiasi dengan Credential dan MonthlyReport
      Profile.hasMany(models.Transaction, {
        foreignKey: 'profile_id',
        as: 'transactions',
      });
    }
  }

  Profile.init({
    credential_id: DataTypes.INTEGER,
    full_name: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    phone_number: DataTypes.STRING,
    address: DataTypes.TEXT,
    profile_picture: DataTypes.STRING,
    balance: {
      type: DataTypes.FLOAT,
      defaultValue: 0, 
    }
  }, {
    sequelize,
    modelName: 'Profile',
    freezeTableName: true
  });

  return Profile;
};
