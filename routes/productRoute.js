const express = require("express");
const router = express.Router();

// Import the product controller
const ProductController = require("../controllers/ProductController");

// Import the auth middleware
router.use(require("../middlewares/auth"));
router.get("/pub", ProductController.findByProductName);

// Import the admin middleware
router.use(require("../middlewares/adminAccess"));

// Define product route for admin access
router.get("/list", ProductController.getAll);
router.post("/add", ProductController.add);
router.put("/edit", ProductController.edit);
router.put("/detail/edit", ProductController.editDetail);
router.delete("/delete", ProductController.delete);

module.exports = router;
