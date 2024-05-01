"use strict";
const { Model } = require("sequelize");
const { uuid } = require("uuidv4");

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
      hooks: {
        beforeCreate(history) {
          history.id = uuid();
        },
      },
    }
  );
  return AdminHistory;
};
