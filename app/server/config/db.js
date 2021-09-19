require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("bufferCommands", false);

const dbURL = process.env.MONGO_URI;

//Establish database connection
const connectDB = async () => {
  try {
    await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });

    console.log("Database connection successful");
  } catch (e) {
    console.log("connection to database failed");
    console.error(e.message);
    process.exit(1);
  }
};

module.exports = { connectDB };