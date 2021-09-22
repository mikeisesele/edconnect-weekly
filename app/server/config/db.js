require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("bufferCommands", false);
const promiseRetry = require("promise-retry");

const dbURL = process.env.MONGO_URI;
/**
 * @desc Sets the fields necessary for the mongoose connection
 */
const connectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  reconnectTries: 60,
  reconnectInterval: 1000,
  poolSize: 10,
  bufferMaxEntries: 0,
};

/**
 * @Desc handles the disconnection from the database
 */
const promiseRetryOptions = {
  retries: connectionOptions.reconnectTries,
  factor: 1.5,
  minTimeout: connectionOptions.reconnectInterval,
  maxTimeout: 5000,
};

/**
 * @Desc connects to the database
 */
const connectDB = async () => {
  try {
    return promiseRetry( async (retry, number) => {
      console.log(
        `MongoClient connecting to ${dbURL} - retry number: ${number}`
      );
      return await mongoose.connect(dbURL, connectionOptions).catch(retry);
    }, promiseRetryOptions )
    
  } catch (e) {
    console.log("connection to database failed");
    console.error(e.message);
    process.exit(1);
  }
};

module.exports = { connectDB };