const { Server } = require("socket.io");

const Chat = require("../model/chat");
const Message = require("../model/message");

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });

  //Add this before the app.get() block
  io.on("connection", (socket) => {
    // console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("joinChat", ({ targetUserId, fromUserId, fromUserName }) => {
      const roomId = [targetUserId, fromUserId].sort().join("_");
      socket.join(roomId);
    });

    socket.on("message", async (data) => {
      try {
        const roomId = [data.targetUserId, data.fromUserId].sort().join("_");

        let chat = await Chat.findOne({
          users: { $all: [data.targetUserId, data.fromUserId] },
        });

        if (!chat) {
          chat = new Chat({
            users: [data.targetUserId, data.fromUserId],
            lastMessage: null,
          });

          await chat.save();
        }

        let message = new Message({
          chatId: chat._id,
          senderId: data.fromUserId,
          text: data.text,
        });

        await message.save();

        await Chat.findByIdAndUpdate(chat._id, {
          lastMessage: message._id,
        });

        message = await message.populate("senderId", "firstName lastName");

        io.to(roomId).emit("messageResponse", message);
      } catch (error) {
        console.log(error);
      }
    });
  });
};

module.exports = initializeSocket;
