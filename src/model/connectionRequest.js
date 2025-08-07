const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ConnectionRequestSchema = Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUES} is not supported !!`,
      },
    },
  },
  { timestamps: true }
);

const ConnectionRequest = model("ConnectionRequest", ConnectionRequestSchema);

module.exports = ConnectionRequest;
