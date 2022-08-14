'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class commandblockuser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  commandblockuser.init({
    serverID: DataTypes.BIGINT,
    userID: DataTypes.BIGINT,
    command: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'commandblockuser',
  });
  return commandblockuser;
};