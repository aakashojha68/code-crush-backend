const express = require("express");
const { authUser } = require("../middleware/authUser");
const Chat = require("../model/chat");
const Message = require("../model/message");

const messageRouter = express.Router();

messageRouter.get("/chat/:targetUserId", authUser, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { targetUserId } = req.params;

    const chat = await Chat.findOne({
      users: { $all: [loggedInUser._id, targetUserId] },
    });

    if (!chat) {
      return res.send({ message: "No record found !!", data: [] });
    }

    const messages = await Message.find({ chatId: chat._id }).populate({
      path: "senderId",
      select: "firstName lastName",
    });

    return res.send({
      message: "Data fetched successfully !!",
      data: messages,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = messageRouter;
