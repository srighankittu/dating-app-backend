const express = require("express");
const { userAuth } = require("../middleware/authUtil");
const { ConnectionRequest } = require("../models/connectionRequest");
const { User } = require("../models/user");
const requestsRouter = express.Router();

requestsRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserID = req.user._id;
    const toUserID = req.params.toUserId;
    const status = req.params.status;
    const allowedStatus = ["ignored", "interested"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Invalid Status");
    }
    const isValidUser = await User.findById(toUserID);
    if (!isValidUser) {
      return res.status(400).json({
        message: "Invalid User",
      });
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserID, toUserID },
        { fromUserID: toUserID, toUserID: fromUserID },
      ],
    });

    if (existingConnectionRequest) {
      return res.status(400).json({
        message: "Connection Request already Exists",
        s,
      });
    }

    const request = new ConnectionRequest({
      fromUserID,
      toUserID,
      status,
    });
    const data = await request.save();
    res.json({
      message: "Sent!",
      data,
    });
  } catch (err) {
    res.status(400).send("Error" + err.message);
  }
});

requestsRouter.get("/getRequests", userAuth, async (req, res) => {
  try {
    const userID = req.user._id;
    const requests = await ConnectionRequest.find({ fromUserID: userID });
    res.status(200).send(requests);
  } catch {
    throw new Error("Unable to fetch requests");
  }
});

module.exports = requestsRouter;
