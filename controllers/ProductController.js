const { uuid } = require("uuidv4");
const { Product, Detail, sequelize, AdminHistory } = require("../models");

class ProductController {
  static async getAll(req, res, next) {
    try {
      // query data from table Products with eager loading table Details
      const products = await Product.findAll({
        where: { isDelete: false },
        attributes: ["id", "name", "price", "stock", "imgUrl"],
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
        price,
        stock,
        imgUrl,
      };

      // prepare data for table Details
      const detailData = {
        ProductId,
        launch,
        os,
        resolution,
        internalMemory,
        ram,
        mainCamera,
        selfieCamera,
        battery,
        brand,
        otherSpec,
      };

      // prepare data for table AdminHistories
      const historyData = {
        UserId: req.user.id,
        ProductId: ProductId,
        changeType: "add",
      };

      // insert data to table Products, Details and AdminHistories
      const newProduct = await Product.create(productData, { transaction: t });
      const newDetail = await Detail.create(detailData, { transaction: t });
      await AdminHistory.create(historyData, { transaction: t });

      // commit atomic transaction if all query success
      await t.commit();

      // send response
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
      const { ProductId, name, stock, price, imgUrl } = req.body;
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
        price,
        stock,
        imgUrl,
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

      const historyData = {
        UserId,
        ProductId,
        changeType: "edit",
        beforeChange,
        afterChange,
      };

      // update data product
      await product.update(dataEdit, { transaction: t });

      // insert data to table AdminHistories
      await AdminHistory.create(historyData, { transaction: t });

      // commit atomic transaction if all query success
      await t.commit();

      res.status(200).json({ message: "Success edit product", data: product });
    } catch (error) {
      t.rollback();
      next(error);
    }
  }

  static async editDetail(req, res, next) {
    const t = await sequelize.transaction();

    try {
      // get ProductId from input user
      const { ProductId } = req.body;

      // check if DetailId is empty
      if (!ProductId) {
        throw { name: "Invalid input", message: "Product id is required" };
      }

      // find detail data in database
      const detail = await Detail.findOne({ where: { ProductId } });

      // check if detail data is empty
      if (!detail) {
        throw { name: "Not Found", message: "Detail not found" };
      }

      // prepare edit data for table Details
      const {
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
      } = req.body;

      let dataEdit = {
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
      };
      let beforeChange = "";
      let afterChange = "";

      // cleat empty data, null, or undefined from input user
      for (let key in dataEdit) {
        if (!dataEdit[key] && key !== "ProductId") {
          delete dataEdit[key];
        } else {
          beforeChange += `${key}:${detail[key]};`;
          afterChange += `${key}:${dataEdit[key]};`;
        }
      }

      // prepare data for table AdminHistory
      const historyData = {
        UserId: req.user.id,
        ProductId: detail.ProductId,
        changeType: "edit",
        beforeChange,
        afterChange,
      };

      // update data detail and add history data
      await detail.update(dataEdit, { transaction: t });
      await AdminHistory.create(historyData, { transaction: t });

      // commit atomic transaction if all query success
      await t.commit();
      res
        .status(200)
        .json({ message: "Success edit detail product", data: detail });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }

  static async delete(req, res, next) {
    // create transaction for atomic transaction
    const t = await sequelize.transaction();

    try {
      // get ProductId from input user
      const { ProductId } = req.body;

      // check if ProductId is empty
      if (!ProductId) {
        throw { name: "Invalid input", message: "ProductId is required" };
      }

      // find product data in database
      const productToDel = await Product.findByPk(ProductId);

      if (!productToDel) {
        throw { name: "Not Found", message: "Product not found" };
      }

      // prepare data for table AdminHistories
      const historyData = {
        UserId: req.user.id,
        ProductId: ProductId,
        changeType: "delete",
      };

      // delete product data
      // await productToDel.destroy({ transaction: t });
      await productToDel.update({ isDelete: true }, { transaction: t });

      // prepare data for response
      let responseData = {
        name: productToDel.name,
        statusDelete: productToDel.isDelete,
      };

      // insert data to table AdminHistories
      await AdminHistory.create(historyData, { transaction: t });

      // commit atomic transaction if all query success
      await t.commit();

      res
        .status(200)
        .json({ message: "Success delete product", data: responseData });
    } catch (error) {
      await t.rollback();
      next(error);
    }
  }
}

module.exports = ProductController;
