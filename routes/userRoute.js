const express = require("express");
const router = express.Router();

// Import the user controller
const UserController = require("../controllers/UserController");

// Define user route
router.post("/register", UserController.register);
router.post("/login", UserController.login);

module.exports = router;
