const { Product, Detail } = require("../models");

class ProductController {
  static async getAll(req, res, next) {
    try {
      // query data from table Products with eager loading table Details
      const products = await Product.findAll({
        attributes: ["id", "name", "brand"],
        include: {
          model: Detail,
          attributes: { exclude: ["id", "createdAt", "updatedAt"] },
        },
      });

      // send response
      res.status(200).json({ message: "List products", data: products });
    } catch (error) {
      next(error);
    }
  }

  static async add(req, res, next) {
    try {
      // get data from body request or input user
      const {
        name,
        brand,
        stock,
        ProductId,
        launch,
        os,
        imgUrl,
        resolution,
        internalMemory,
        ram,
        mainCamera,
        selfieCamera,
        battery,
        otherSpec,
        price,
      } = req.body;

      res.status(200).json({ message: "Success add product" });
    } catch (error) {
      next(error);
    }
  }

  static async edit(req, res, next) {
    try {
      res.status(200).json({ message: "Success edit product", data: {} });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      res.status(200).json({ message: "Success delete product", data: {} });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;
