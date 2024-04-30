class UserController {
  static async register(req, res, next) {
    try {
      res.status(201).json({ message: "Success create user" });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res) {
    try {
      res.status(200).json({ message: "Success login", token: "Access Token" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
