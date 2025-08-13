const express = require("express");
const { authUser } = require("../middleware/authUser");
const {
  validateSendRequest,
  validateReviewRequest,
} = require("../utils/validation");
const User = require("../model/user");
const ConnectionRequest = require("../model/connectionRequest");
const { USER_SAFE_DATA } = require("../utils/constants");

const connectionRequestRouter = express.Router();

connectionRequestRouter.get(
  "/request/send/:status/:toUserId",
  authUser,
  async (req, res) => {
    try {
      validateSendRequest(req, res);

      const { status, toUserId } = req.params;
      const loggedInUser = req.user;

      if (loggedInUser._id.toString() === toUserId) {
        return res
          .status(400)
          .json({ message: "User cannot send request to himself." });
      }

      const toUserData = await User.findById(toUserId);

      if (!toUserData) {
        return res.status(400).json({ message: "User not found !!" });
      }

      const isRequestSent = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: loggedInUser._id, toUserId },
          { toUserId: loggedInUser._id, fromUserId: toUserId },
        ],
      });

      if (isRequestSent) {
        return res
          .status(400)
          .json({ message: "Cannot sent duplicate request !!" });
      }

      const connectionRequestInstance = new ConnectionRequest({
        fromUserId: loggedInUser._id,
        toUserId,
        status,
      });

      const response = await connectionRequestInstance.save();

      res.json({
        message: `${loggedInUser.firstName} successfully sent invitation request to ${toUserData.firstName}`,
        data: response,
      });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

connectionRequestRouter.get(
  "/request/review/:status/:requestId",
  authUser,
  async (req, res) => {
    try {
      validateReviewRequest(req, res);

      const { status, requestId } = req.params;

      const request = await ConnectionRequest.findOne({
        _id: requestId,
        status: "interested",
      });

      if (!request) {
        return res.status(400).json({ message: "Request not found !!" });
      }

      request.status = status;

      const savedRequest = await request.save();

      console.log(savedRequest);

      res.json({
        message: `Request ${status} successfully !!`,
        data: savedRequest,
      });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

connectionRequestRouter.get("/request/received", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const pendingConnection = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate({ path: "fromUserId", select: USER_SAFE_DATA });

    res.json({
      message: "Data fetched successfully !!",
      data: pendingConnection,
    });
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
});

module.exports = connectionRequestRouter;
