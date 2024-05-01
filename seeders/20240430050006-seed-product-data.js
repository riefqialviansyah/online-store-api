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
        price: product.price,
        stock: product.stock,
        imgUrl: product.imgUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return tmpData;
    });

    // prepare data for table Details
    const seedDetailData = productData.map((detail, idx) => {
      delete detail.name;
      delete detail.price;
      delete detail.stock;
      delete detail.imgUrl;

      detail.id = uuid();
      detail.launch = new Date(detail.launch);
      detail.ProductId = seedProductData[idx].id;
      detail.createdAt = detail.updatedAt = new Date();

      return detail;
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
