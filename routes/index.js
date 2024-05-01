const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello, welcom to online store mobile phone",
    createdBy: "Riefqi Alviansyah",
    github: "https://github.com/riefqialviansyah",
  });
});

// use the routes
router.use("/user", require("./userRoute"));
router.use("/product", require("./productRoute"));

module.exports = router;
