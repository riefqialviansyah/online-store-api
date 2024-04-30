const express = require("express");
const router = express.Router();

// use the routes
router.use("/user", require("./userRoute"));
router.use("/product", require("./productRoute"));

module.exports = router;
