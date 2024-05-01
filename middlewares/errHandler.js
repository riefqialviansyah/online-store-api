const errHandler = (err, req, res, next) => {
  switch (err.name) {
    case "Invalid Input":
      res.status(400).json({ message: err.message });
      break;
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      break;
    case "Unauthorized":
    case "Invalid token":
      res.status(401).json({ message: err.message });
      break;
    case "Forbidden":
      res.status(403).json({ message: err.message });
      break;
    case "Not Found":
      res.status(404).json({ message: err.message });
      break;
    default:
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
      break;
  }
};

module.exports = errHandler;
