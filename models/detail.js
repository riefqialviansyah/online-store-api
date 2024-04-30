"use strict";
const { Model } = require("sequelize");
const { uuid } = require("uuidv4");
module.exports = (sequelize, DataTypes) => {
  class Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Detail.belongsTo(models.Product, { foreignKey: "ProductId" });
    }
  }
  Detail.init(
    {
      ProductId: DataTypes.NUMBER,
      launch: DataTypes.DATE,
      os: DataTypes.STRING,
      imgUrl: DataTypes.STRING,
      resolution: DataTypes.STRING,
      internalMemory: DataTypes.STRING,
      ram: DataTypes.STRING,
      mainCamera: DataTypes.STRING,
      selfieCamera: DataTypes.STRING,
      battery: DataTypes.STRING,
      otherSpec: DataTypes.STRING,
      price: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Detail",
      hooks: {
        beforeCreate(detail) {
          detail.id = uuid();
        },
      },
    }
  );
  return Detail;
};
