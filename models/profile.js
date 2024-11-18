'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Profile.init({
    credential_id: DataTypes.INTEGER,
    full_name: DataTypes.STRING,
    date_of_birth: DataTypes.DATE,
    phone_number: DataTypes.STRING,
    address: DataTypes.TEXT,
    profile_picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};