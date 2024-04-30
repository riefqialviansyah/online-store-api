"use strict";

const { uuid } = require("uuidv4");
const { hashPassword } = require("../helpers/bcrypt");

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
    const userData = require("../data/user.json");
    const seedUserData = userData.map((user) => {
      user.id = uuid();
      user.createdAt = user.updatedAt = new Date();
      user.password = hashPassword(user.password);

      return user;
    });

    await queryInterface.bulkInsert("Users", seedUserData);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
