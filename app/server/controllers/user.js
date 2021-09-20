const express = require("express");
const { getPrograms, getGradYears } = require("../services/school");
const User = require("../services/user");
const isLoggedIn = require("../middlewares/auth");
const multerUploads = require("../middlewares/multer");
const router = express.Router();
import { cloudinary } from "../middlewares/cloudinery";

const programs = getPrograms();
const graduationYears = getGradYears();

// @desc show sign up page
// @route GET /signup
router.get("/signup", (req, res) => {
  // we are accessing the services here
  const programs = getPrograms();
  const graduationYears = getGradYears();
  const error = req.flash("error");
  const user = req.session.user;

  // passing the variables to the view
  res.render("Signup", {
    program: programs,
    graduationYear: graduationYears,
    err: error,
    user: user,
  });
});

// @desc handle signup click
// @route POST /signup
router.post("/signup", async (req, res) => {
  const firstname = req.body.firstName;
  const lastname = req.body.lastName;

  const { email, password, program, matricNumber, graduationYear } = req.body;

  const check = await User.create({
    firstname,
    lastname,
    email,
    password,
    matricNumber,
    program,
    graduationYear,
  });

  if (check[0]) {
    req.session.user = check[1];
    res.redirect("/");
  } else {
    req.flash("error", check[1]);
    res.redirect(303, "/signup");
  }
});

// @desc Show login page
// @route GET /login
router.get("/login", (req, res) => {
  const error = req.flash("error");
  const user = req.session.user;
  res.render("Login", { err: error, user: user });
});

// @desc handle log in click
// @route POST /login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const check = await User.authenticate(email, password);

  if (check[0]) {
    req.session.user = check[1];
    res.redirect("/");
  } else {
    req.flash("error", check[1][0]);
    res.redirect(303, "/login");
  }
});

// @desc Show forgot password reset page
// @route GET /forgotPassword
router.get("/forgotPassword", async (req, res) => {
  const error = req.flash("error");
  const user = req.session.user;
  res.render("ForgotPassword", { err: error, user: user });
});

// @desc Show password reset page
// @route GET /resetPassword
router.get("/resetPassword", async (req, res) => {
  const error = req.flash("error");
  res.render("ResetPassword", { error, user });
});

// @desc Show edit page
// @route GET /profile
router.get("/profile", async (req, res) => {
  try {
    if (req.session) {
      const user = await User.getById(req.session.user._id);
      res.render("ProfileDetail", { user, programs, graduationYears });
    } else {
      res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
  }
});

// @desc Handle update profile click
// @route POST /profile
router.post("/profile", multerUploads, async (req, res) => {
  const id = req.session.user._id;

  const { firstName, lastName, graduationYear, program } = req.body;

  // reset graduation year and program if user does not select
  if (graduationYear === "Select Graduation Year") {
    graduationYear = "";
  }
  if (program === "Select Program") {
    program = "";
  }

  try {
    // get user current detail before update
    const user = await User.getById(id);

    // create a new user detail with the information provided from the request
    const newUserProfile = {
      program,
      graduationYear,
      firstName,
      lastName,
      profilePicture: user?.profilePicture,
      ...req.body,
    };

    // it there is a file
    if (req.file) {
      // Upload image to cloudinary
      await cloudinary.uploader.upload(req.file.path, function (error, result) {
        // if upload is successful
        if (result) {
          // // set the new user image to url
          newUserProfile.profilePicture = result.url;
          return newUserProfile.profilePicture;
        }
      });
    }

    // update current user with new detail
    const result = await User.updateUser(id, newUserProfile);

    if (result[0]) {
      req.session.user = result[1];
      res.redirect("/profile");
    }
  } catch (err) {
    console.error(err);
  }
});

// @desc Log out a user
// @route GET /logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

module.exports = router;
