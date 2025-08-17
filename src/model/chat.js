const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const chatSchema = new Schema(
  {
    users: { type: [Schema.Types.ObjectId], required: true, ref: "User" },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
  },
  {
    timestamps: true,
  }
);

const Chat = model("Chat", chatSchema);

module.exports = Chat;
