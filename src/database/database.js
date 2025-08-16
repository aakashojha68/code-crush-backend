const mongoose = require("mongoose");
const mongodb_url = process.env.DATA_BASE_URL;

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
