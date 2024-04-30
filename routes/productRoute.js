const express = require("express");
const router = express.Router();

// Import the product controller
const ProductController = require("../controllers/ProductController");

// Define product route
router.get("/list", ProductController.getAll);
router.post("/add", ProductController.add);
router.put("/edit", ProductController.edit);
router.delete("/delete", ProductController.delete);

module.exports = router;
