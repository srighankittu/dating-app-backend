const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/authUtil");
const { User } = require("../models/user");

profileRouter.post("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

profileRouter.get("/user", async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.find({
      email,
    });
    if (user.length != 0) {
      res.send(user);
    } else {
      res.status(404).send("USer not found bitch");
    }
  } catch (err) {
    res.status(400).send("Some Issue IDC about");
  }
});

//delete user
profileRouter.delete("/user", async (req, res) => {
  try {
    const userID = req.body.userID;
    await User.findByIdAndDelete(userID);
    res.send("User Deleted Successfuly");
  } catch (err) {
    res.status(500).send("User was not deleted");
  }
});

//feed API to get all users in the DB
profileRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("unable to fetch Users for your feed");
  }
});

profileRouter.patch("/user/:userID", async (req, res) => {
  try {
    // const id = req.body.userID; Can be ferched from the params and not from body
    const id = req.params.userID;
    const data = req.body;
    const ALLOWED_UPDATES = ["photoUrl", "about", "skills"];
    const isUpdateAllowed = Object.keys(data).every((item) => {
      return ALLOWED_UPDATES.includes(item);
    });
    if (!isUpdateAllowed) throw new Error("You cannot update these detail(s)");
    if (data.skills.length > 10)
      throw new Error("You cannot add more than 10 skills dude, wtf?");
    await User.findOneAndUpdate({ _id: id }, data, {
      returnDocument: "before", // Will return document before update, "after" will return new document after update
      runValidators: true, // will do the validation checks even on patch calls. By default they apply only on new documents
    });
    res.send("Data Updated Successfully!");
  } catch (err) {
    res.status(500).send("User Data Cannot be updated" + err);
  }
});

module.exports = profileRouter;
