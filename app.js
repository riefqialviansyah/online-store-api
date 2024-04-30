require("dotenv").config();

const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Use the routes
app.use(require("./routes"));

// Error handler
app.use(require("./middlewares/errHandler"));

module.exports = app;
