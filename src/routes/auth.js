const express = require("express");
const { User } = require("../models/user");
const { signUpValidations } = require("../utils/validation");
const bcrypt = require("bcrypt");
const req = require("express/lib/request");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // validations
    signUpValidations(req);
    // Encryot password
    const { password, firstName, lastName, email, age } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      age,
    });
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.send("Some issue dude! " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("You never signed up dick!");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Create a jwt token
      const token = await user.getJWT();
      // Add token to cookie
      res.cookie("token", token);
      // Send it back to user
      res.json({
        message: "Logged in Successfully",
        data: user,
      });
    } else {
      res.status(400).json({
        message: "You forgot your password dweeb!",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "LOL " + err.message,
    });
  }
});

authRouter.post("/logout", async (req, res) => {
  try {
    res
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .status(200)
      .send("Logout Successful");
  } catch (err) {
    console.log("You cannot logout because of " + err.msg);
  }
});

module.exports = authRouter;
