'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Credential extends Model {
    static associate(models) {
      // Credential memiliki satu Profile
      Credential.hasOne(models.Profile, {
        foreignKey: 'credential_id',
        as: 'profile',
      });
    }
  }
  Credential.init({
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    reset_password_token: DataTypes.STRING,
    reset_password_expires: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Credential',
    freezeTableName: true,
  });
  return Credential;
};
