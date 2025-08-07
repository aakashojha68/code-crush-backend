const express = require("express");
const { connectDb } = require("./database/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const connectionRequestRoutes = require("./routes/connectionRequestRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", userProfileRoutes);
app.use("/", connectionRequestRoutes);
app.use("/", userRouter);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server is listening on ", PORT);
    });
  })
  .catch((err) => console.log("Error is mongo db connection " + err.message));
