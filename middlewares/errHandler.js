const errHandler = (err, req, res, next) => {
  switch (err.name) {
    case "value":
      break;

    default:
      res.status(500).json({ message: "Internal server error" });
      break;
  }
};

module.exports = errHandler;
