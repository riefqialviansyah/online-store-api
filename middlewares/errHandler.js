const errHandler = (err, req, res, next) => {
  switch (err.name) {
    case "Invalid Input":
      res.status(400).json({ message: err.message });
      break;
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "Invalid token":
    case "Unauthorized":
      res.status(403).json({ message: err.message });
      break;
    default:
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
      break;
  }
};

module.exports = errHandler;
