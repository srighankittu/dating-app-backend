const express = require("express");
const { userAuth } = require("../middleware/authUtil");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const userRouter = express.Router();

//Get all pending connections requests
userRouter.get("/connection-requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { _id } = loggedInUser;
    const connectionRequests = await ConnectionRequest.find({
      toUserID: _id,
      status: "interested",
    }).populate("fromUserID", ["firstName", "lastName"]);
    res.status(200).json({
      message: "Done!",
      data: connectionRequests,
    });
  } catch (err) {
    throw new Error("Some issue here!" + err.message);
  }
});

//Get all accepted connections
userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { _id } = loggedInUser;
    const connections = await ConnectionRequest.find({
      $or: [{ toUserID: _id }, { fromUserID: _id }],
      status: "accepted",
    })
      .populate("fromUserID", ["firstName", "lastName"])
      .populate("toUserID", ["firstName", "lastName"]);
    if (!connections) {
      res.status(200).send("No connections yet");
    }
    const data = connections.map((row) => {
      if (row.fromUserID._id.toString() === _id.toString()) {
        return row.toUserID;
      }
      return row.fromUserID;
    });
    res.status(200).json({
      message: "Theses are Connections",
      data: data,
    });
  } catch (err) {
    throw new Error("Nah boi " + err.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const { _id } = req.user;
    const page = parseInt(req.query.page) || 10;
    const limit = parseInt(req.query.limit) || 2;
    const skip = (page - 1) * limit;
    // console.log(loggedInUser);
    //Get all users who have interacted with loggedIn user
    const connectedUsers = await ConnectionRequest.find({
      $or: [{ toUserID: _id }, { fromUserID: _id }],
    }).select("fromUserID toUserID");

    const hideUsersFeed = new Set();
    connectedUsers.forEach((req) => {
      hideUsersFeed.add(req.fromUserID._id);
      hideUsersFeed.add(req.toUserID._id);
    });

    const users = await User.find({
      _id: { $nin: Array.from(hideUsersFeed), $ne: _id }, //$ne should be there because if a new user logs in with no interactions
      // then they will not be excluded in above logic so need to exclude here!
    })
      .select("firstName lastName")
      .skip(skip)
      .limit(limit);
    res.json({
      message: "Done!",
      data: users,
    });
  } catch (err) {
    res.status(400).send("Some Error! " + err.message);
  }
});

module.exports = userRouter;
