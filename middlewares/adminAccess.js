const adminAccess = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role != "admin") {
      throw {
        name: "Forbidden",
        message: "You are not authorized to access site",
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminAccess;
