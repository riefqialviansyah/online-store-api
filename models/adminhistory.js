"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AdminHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AdminHistory.init(
    {
      UserId: DataTypes.UUID,
      ProductId: DataTypes.UUID,
      changeType: DataTypes.STRING,
      beforeChange: DataTypes.TEXT,
      afterChange: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "AdminHistory",
    }
  );
  return AdminHistory;
};
