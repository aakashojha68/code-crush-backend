const mongoose = require("mongoose");
const mongodb_url =
  "mongodb+srv://aakashojha68:KYqcDdTf0gflfDt6@cluster0.ykznzlk.mongodb.net/devTinder";

const connectDb = async () => {
  try {
    await mongoose.connect(mongodb_url);
    console.log("Connected to DB:", mongoose.connection.name);

    console.log("Connection establish successful..");
  } catch (error) {
    console.log("Error in connecting mongo db...");
  }
};

module.exports = {
  connectDb,
};
