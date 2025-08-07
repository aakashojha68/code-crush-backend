const express = require("express");
const { authUser } = require("../middleware/authUser");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");

const userRouter = express.Router();

userRouter.get("/user/connections", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      status: "accepted",
    }).populate([{ path: "fromUserId" }, { path: "toUserId" }]);

    const extractedConnections = connections.map((user) =>
      user.fromUserId._id.toString() === loggedInUser._id.toString()
        ? user.toUserId
        : user.fromUserId
    );

    res.json({
      message: "Connections fetched successfully !!",
      data: extractedConnections,
    });
  } catch (error) {
    res.status(400).json({ message: "Error - " + error.message });
  }
});

userRouter.get("/user/feed", authUser, async (req, res) => {
  // not contain logged in user profile.
  // not contain connection profile
  // only contain profile which are not connected in any manner.

  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    });

    const uniqueUserId = new Set();
    connections.forEach((req) => {
      uniqueUserId.add(req.fromUserId.toString());
      uniqueUserId.add(req.toUserId.toString());
    });

    const users = await User.find({ _id: { $nin: [...uniqueUserId] } });

    res.status(200).json({
      message: "Detail fetched successfully !!",
      data: users,
    });
  } catch (error) {
    res.send(400).json({ message: "Error - " + error.message });
  }
});

//TODO: show user pending connection request

module.exports = userRouter;
