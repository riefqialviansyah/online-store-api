"use strict";

const { uuid } = require("uuidv4");
const { Product, sequelize } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    // create transaction for atomic transaction
    const t = await sequelize.transaction();

    // import data from json
    const productData = require("../data/mobile_phone.json");

    // prepare data for table Products
    const seedProductData = productData.map((product) => {
      const tmpData = {
        id: uuid(),
        name: product.name,
        isDelete: false,
        brand: product.brand,
        stock: product.stock,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return tmpData;
    });

    // prepare data for table Details
    const seedDetailData = productData.map((product, idx) => {
      delete product.name;
      delete product.brand;
      delete product.stock;

      product.id = uuid();
      product.launch = new Date(product.launch);
      product.ProductId = seedProductData[idx].id;
      product.createdAt = product.updatedAt = new Date();

      return product;
    });

    // insert data to table Products
    await queryInterface.bulkInsert("Products", seedProductData, {
      transaction: t,
    });

    // insert data to table Details
    await queryInterface.bulkInsert("Details", seedDetailData, {
      transaction: t,
    });

    await t.commit();
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // delete all data in table Products
    await queryInterface.bulkDelete("Products", null, {});

    // delete all data in table Products
    await queryInterface.bulkDelete("Details", null, {});
  },
};
