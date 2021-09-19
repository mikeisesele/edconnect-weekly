const express = require("express");
const { getPrograms, getGradYears } = require("../services/school");
const User = require("../services/user");
const isLoggedIn = require("../middlewares/auth");
const multer = require("multer");
const { storage } = require("../middlewares/cloudinery");
const cloudineryStorage = multer(storage);

const router = express.Router();

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
    const user = await User.getById(req.session.user._id);

    if (user) {
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
router.post(
  "/profile",
  cloudineryStorage.single("profilePicture"),
  async (req, res) => {
    // const result = "";

    // if (req.file.path) {
    //   result = await cloudinary.v2.uploader.upload(req.file.path, {
    //     width: 50,
    //     height: 50,
    //     crop: "fit",
    //   });
    // }

    console.log(req.file.path)
    console.log(`result: ${req.file}`);

    // if (req.user) {
    //   updatedUser.profilePic = result.url;
    //   updatedUser.profilePicCloudinaryId = result.public_id;
    // }
    // if (req.user?.profilePicCloudinaryId) {
    //   await cloudinary.v2.uploader.destroy(
    //     req.user?.profilePicCloudinaryId
    //   );
    // }

    const { firstName, lastName } = req.body;
    let graduationYear, program;

    // reset graduation year and program if user does not select
    if (graduationYear === "Select Graduation Year") {
      graduationYear = "";
    }
    if (program === "Select Program") {
      program = "";
    }

    // get existing user
    const user = await User.getById(req.session.user._id);

    const newUser = {
      program,
      graduationYear,
      firstName,
      lastName,
      profilePicture: user?.profilePicture,
      ...req.body,
    };

    // if (result && result.url != profilePicture) {
    //   user.profileImage = result.url; // req.file.path;
    // } else {
    //   newUser.profileImage = user.profilePicture;
    // }

    try {
      const id = req.session.user._id;
      const result = await User.updateUser(id, newUser);

      if (result[0]) {
        res.redirect("/profile");
      }
    } catch (err) {
      console.error(err);
    }
  }
);

// @desc Log out a user
// @route GET /logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

module.exports = router;
