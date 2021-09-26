require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("bufferCommands", false);

const dbURL = process.env.MONGO_URI;
/**
 * @desc Sets the fields necessary for the mongoose connection
 */
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

/**
 * @Desc connects to the database
 */
const connectDB = async () => {
  try {
      return await mongoose.connect(dbURL, connectionOptions)    
  } catch (e) {
    console.log("connection to database failed");
    console.error(e.message);
    process.exit(1);
  }
};

// disconnectDB
const disconnectDB = async () => {
  try {
    return await mongoose.disconnect();
  } catch (e) {
    console.log("disconnection from database failed");
    console.error(e.message);
    process.exit(1);
  }
};

module.exports = { connectDB , disconnectDB };