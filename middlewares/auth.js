const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

const auth = async (req, res, next) => {
  try {
    // get authorization header
    const { authorization } = req.headers;

    // check if authorization header is exist
    if (!authorization) {
      throw { name: "Invalid token", message: "Invalid token" };
    }

    // split authorization header
    const [type, token] = authorization.split(" ");

    // check if token type is Bearer
    if (type !== "Bearer") {
      throw { name: "Invalid token", message: "Invalid token" };
    }

    // verify token
    const decrypToken = verifyToken(token);

    // check if user with id from token is exist
    const user = await User.findOne({ where: { id: decrypToken.id } });

    // check if user is exist
    if (!user) {
      throw { name: "Unauthorized", message: "Invalid token" };
    }

    // set req.user with user data, so we can access user data in next middleware
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
