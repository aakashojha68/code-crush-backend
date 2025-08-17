const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { connectDb } = require("./database/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const connectionRequestRoutes = require("./routes/connectionRequestRoutes");
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoute");
const app = express();
const PORT = process.env.PORT;
const { createServer } = require("http");
const initializeSocket = require("./utils/socket");
const server = createServer(app);

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/", authRouter);
app.use("/", userProfileRoutes);
app.use("/", connectionRequestRoutes);
app.use("/", userRouter);
app.use("/", messageRouter);

initializeSocket(server);

connectDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server is listening on ", PORT);
    });
  })
  .catch((err) => console.log("Error is mongo db connection " + err.message));
