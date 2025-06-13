const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }
    const decode = await jwt.verify(token, "SECRET_KEY");
    const { _id } = decode;
    const user = await User.findOne({ _id });
    if (!user) throw new Error("Not a valid user");
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Some issue with cookie: " + err.message);
  }
};

module.exports = {
  userAuth,
};
