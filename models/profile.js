'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    static associate(models) {
      // Profile milik Credential
      Profile.belongsTo(models.Credential, {
        foreignKey: 'credential_id',
        as: 'credential',
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
  }, {
    sequelize,
    modelName: 'Profile',
    freezeTableName: true,
  });
  return Profile;
};
