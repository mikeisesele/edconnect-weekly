const mongoose = require("mongoose");
const UserSchema = mongoose.Schema;
const crypto = require("crypto");

const userSchema = new UserSchema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true, minlength: 7 },
    salt: { type: String, required: true },
    matricNumber: { type: String },
    program: { type: String },
    graduationYear: { type: String },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dlcz32wwl/image/upload/v1632083119/project-explorer/SeekPng.com_profile-icon-png_9665493_vfozc0.png",
    },
    facebookId: { type: String },
    googleId: { type: String },
    provider: { type: String },
    // passwordToken: {
    //   data: String,
    //   default: "",
    // }
  },
  { timestamps: true }
);

userSchema.methods.setPassword = function (password) {
  // encrypt the passwor
  if (password.length >= 7) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.password = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
  } else {
    throw new Error("Password should have at least 7 characters");
  }
};

// when you have a hashed password, a combination of the naked password with that particular salt should bring the exact hash password. (here we access the password from the schema)
userSchema.methods.validPassword = function (userObject, password) {
  // hash password  == bare passwowrd and salt
  return (
    userObject.password ===
    crypto
      .pbkdf2Sync(password, userObject.salt, 1000, 64, "sha512")
      .toString("hex")
  );
};

// the user in strings is the name of the collection to be set in mongo db
// UserSchema is the structure that collection will take. it is the instance of the predefined schema
const User = mongoose.model("User", userSchema);

module.exports = User;
