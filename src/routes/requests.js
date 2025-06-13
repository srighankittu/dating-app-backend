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

requestsRouter.post(
  "/review/:status/:requestID",
  userAuth,
  async (req, res) => {
    try {
      const { _id } = req.user;
      const { status, requestID } = req.params;
      //existing status should be interested only
      //accepted statuses
      const acceptedStatus = ["accepted", "rejected"];
      if (!acceptedStatus.includes(status)) {
        throw new Error("Invalid Status");
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestID,
        toUserID: _id,
        status: "interested",
      });
      if (!connectionRequest) throw new Error("Invalid Request");

      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: `Connection Request is ${status}`,
        data: data,
      });
    } catch (err) {
      res.status(400).send("Some issue" + err);
    }
  }
);

requestsRouter.get("/getRequests", userAuth, async (req, res) => {
  try {
    const userID = req.user._id;
    const requests = await ConnectionRequest.find({});
    res.status(200).send(requests);
  } catch {
    throw new Error("Unable to fetch requests");
  }
});

module.exports = requestsRouter;
