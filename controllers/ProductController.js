const { uuid } = require("uuidv4");
const { Product, Detail, sequelize, AdminHistory } = require("../models");

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
    // create transaction for atomic transaction
    const t = await sequelize.transaction();

    try {
      // generate ProductId
      const ProductId = uuid();

      // get data from input user
      const {
        name,
        brand,
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
        stock,
      } = req.body;

      // prepare data for table Products
      const productData = {
        id: ProductId,
        name,
        brand,
        stock,
      };

      const newProduct = await Product.create(productData, { transaction: t });

      // prepare data for table Details
      const detailData = {
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
      };

      // insert data to table Details
      const newDetail = await Detail.create(detailData, { transaction: t });

      const historyData = {
        UserId: req.user.id,
        ProductId: ProductId,
        changeType: "add",
      };

      // insert data to table AdminHistories
      await AdminHistory.create(historyData, { transaction: t });

      // commit atomic transaction if all query success
      await t.commit();

      res.status(200).json({
        message: "Success add product",
        product: newProduct,
        detail: newDetail,
      });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async edit(req, res, next) {
    // create transaction for atomic transaction
    const t = await sequelize.transaction();

    try {
      // get ProductId from input user
      const { ProductId, name, brand, stock } = req.body;
      const UserId = req.user.id;

      // check if ProductId is empty
      if (!ProductId) {
        throw { name: "Invalid input", message: "ProductId is required" };
      }

      // find product data in database
      const product = await Product.findByPk(ProductId, { transaction: t });

      if (!product) {
        throw { name: "Not Found", message: "Product not found" };
      }

      // prepare data for table AdminHistory
      let beforeChange = "";
      let afterChange = "";
      let dataEdit = {
        name,
        brand,
        stock,
      };

      // cleat empty data, null, or undefined from input user
      for (let key in dataEdit) {
        if (!dataEdit[key] && key !== "ProductId") {
          delete dataEdit[key];
        } else {
          beforeChange += `${key}:${product[key]};`;
          afterChange += `${key}:${dataEdit[key]};`;
        }
      }
      // update data product
      await product.update(dataEdit, { transaction: t });

      const historyData = {
        UserId,
        ProductId,
        changeType: "edit",
        beforeChange,
        afterChange,
      };

      // insert data to table AdminHistories
      await AdminHistory.create(historyData, { transaction: t });

      await t.commit();

      res.status(200).json({ message: "Success edit product", data: product });
    } catch (error) {
      t.rollback();
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
