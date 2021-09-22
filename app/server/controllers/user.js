const express = require("express");
const { getPrograms, getGradYears } = require("../services/school");
const User = require("../services/user");
const isLoggedIn = require("../middlewares/auth");
const multerUploads = require("../middlewares/multer");
const router = express.Router();
import { cloudinary } from "../middlewares/cloudinery";
const jwt = require("jwt-simple");
import sendMail from "../services/mailService";

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
  res.render("ResetPassword");
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

// @desc Changes the Password of a user
// @route POST /changepassword
router.post("/changepassword", async (req, res) => {
  const render = (page, message) => {
    res.render(page, { message });
  };

  try {
    const userId = req.session.user._id;
    const user = await User.getById(userId);

    if (!user.provider) {
      const currentPassword = req.body.currentPassword;
      const newPassword = req.body.newPassword;
      const confirmPasswordResponse = await User.confirmPassword(
        userId,
        currentPassword
      );
      if (confirmPasswordResponse[0]) {
        await User.updatePassword(id, newPassword);
        res.redirect("/profile");
      } else {
        render("ProfileDetail", "Current password is incorrect");
      }
    } else {
      switch (user.provider) {
        case "google":
          "account was created with google";
          res.redirect(303, "/profile");
          break;
        case "facebook":
          "account was created with facebook";
          res.redirect(303, "/profile");
          break;
      }
    }
  } catch (e) {
    console.log(e.message);
  }
});

// @desc Changes the Password of a user
// @route POST /changepassword
router.post("/emailforresetpassword", async (req, res) => {
  const render = (page, message) => {
    res.render(page, { message });
  };

  try {
    if (req.body) {
      if (req.body.email) {
        var emailAddress = req.body.email;

        const user = await User.getUserByEmail(emailAddress);

        if (user[0]) {
          const id = user[1]._id;
          const hash = user[1].password;
          // User ID from database
          const email = user[1].email;
          const createdAt = user[1].createdAt;

          const payload = { id, email };
          const jwtsecret = hash + `-` + createdAt;
          const token = jwt.encode(payload, jwtsecret);
          const link = `${payload.id}/${token}`;

          sendMail(email, link, user[1].firstName).then((result) => {
            render(
              "ResetPassword",
              "Password reset link has been sent to your email."
            );
          });
        } else {
          render(
            "ResetPassword",
            "No user with this email found in our database"
          );
        }
      } else {
        render("ForgotPassword", "Please enter your email address");
      }
    } else {
      render("ResetPassword", "Not enough information to render page");
    }
  } catch (err) {
    console.error(err);
  }
});

router.get("/resetpassword/:id/:token", async (req, res) => {
  const render = (page, message) => {
    res.render(page, message);
  };

  // Using the ID from the URL parameters, we fetch and validate that the user exists in our database.
  const id = req.params.id;
  const paramsToken = req.params.token;

  const user = await User.getById(id);
  if (user) {
    // TODO: Decrypt one-time-use token using the user's
    // current password hash from the database and combine it
    // with the user's created date to make a very unique secret key!
    const createdAt = user.createdAt;
    const hash = user.password;
    const jwtsecret = hash + `-` + createdAt;
    const payload = jwt.decode(paramsToken, jwtsecret);
    const payloadId = payload.id;
    const token = { payloadId, paramsToken };

    render("ResetPassword", { token });
  }
});

router.post("/resetpassword", async (req, res) => {
  const render = (page, message) => {
    res.render(page, message);
  };

  try {
    // TODO: Fetch user from database using
    const id = req.body.id;
    const token = req.body.token;
    const newPassword = req.body.confirmpassword;
    const user = await User.getById(id);

    if (user) {
      // TODO: Decrypt one-time-use token using the user's
      // current password hash from the database and combining it
      const hash = user.password;
      const createdAt = user.createdAt;
      const jwtsecret = hash + `-` + createdAt;
      try {
        const payload = jwt.decode(token, jwtsecret);
        const id = payload.id;
      } catch (err) {
        console.log(err);
        render("ResetPassword", { message : "Invalid token" });
      }

      if (id == user._id) {
        if (user.validPassword(user, newPassword)) {
          res.render("ResetPassword", {
            error:
              "Your cannot use your last pasword anymore. Please change it.",
          });
        } else {
          user.setPassword(newPassword);
          user.save();

          render("ResetPassword", {
            message:
              "Your password has been successfully changed.",
          });
        }
      }
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
