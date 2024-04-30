"use strict";
const { Model } = require("sequelize");
const { uuid } = require("uuidv4");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasOne(models.Detail, { foreignKey: "ProductId" });
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "Product name already exists" },
        validate: {
          notNull: { msg: "Product name is required" },
          notEmpty: { msg: "Product name is required" },
        },
      },
      isDelete: DataTypes.BOOLEAN,
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Brand is required" },
          notEmpty: { msg: "Brand is required" },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Stock is required" },
          notEmpty: { msg: "Stock is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
