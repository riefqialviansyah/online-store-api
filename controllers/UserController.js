const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
  static async register(req, res, next) {
    try {
      // get input user
      const { username, email, password } = req.body;

      // createa new user data
      const data = {
        username,
        email,
        password,
      };

      // insert new user data to database
      const newUser = await User.create(data);

      // send response
      res.status(201).json({
        message: "Success create user",
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      // get input user
      const { email, password } = req.body;

      // check if email or password is empty
      if (!email || !password) {
        throw {
          name: "Invalid Input",
          message: "Email and password is required",
        };
      }

      // check if email or username is valid
      const user = await User.findOne({ where: { email } });

      // check if user is exist
      if (!user) {
        throw { name: "Unauthorized", message: "Invalid username or password" };
      }

      // check pasword is valid or not
      const isValidPwd = comparePassword(password, user.password);

      // check if password valid
      if (!isValidPwd) {
        throw { name: "Unauthorized", message: "Invalid username or password" };
      }

      // generate token
      const accessToken = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // send response
      res.status(200).json({ message: "Success login", token: accessToken });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
