const express = require("express");
const { getPrograms, getGradYears } = require("../services/school");
const User = require("../services/user");
const isLoggedIn = require("../middlewares/auth");
const multerUploads = require("../middlewares/multer");
const router = express.Router();
import { cloudinary } from "../middlewares/cloudinery";

const programs = getPrograms();
const graduationYears = getGradYears();
// const userInSession = require("../../utils/userInSession");
// const render = require("../../utils/renderView");


/**
 * @desc function to render pages with data
 */
const render = (res, page, message) => {
  res.render(page, message );
};

/**
 * @desc function to get a user from the session
 */
 const userInSession = async (req) => {
   const userId = req?.session?.user ? req.session.user._id : null
   let user = {}
   if(userId != null){
      user = await User.getById(userId);
   }
   return user
 }

/**
 * @desc show sign up page
 * @route GET /signup
 */
router.get("/signup", async (req, res) => {
  const programs = getPrograms();
  const graduationYears = getGradYears();
  const currentUser = await userInSession(req);
  const error = req.flash("error");
 
  // redirect to home page for signup
  render(res, "Signup", { error, 
    response: {
      data: {
        programs,
        graduationYears,
      },
      currentUser,
      result: false,
    },
  });
});


/**
 * @desc handle signup click
 * @route POST /signup
 */
router.post("/signup",  async (req, res) => {
  const firstname = req.body.firstName;
  const lastname = req.body.lastName;
  const error = req.flash("error");

  const { email, password, program, matricNumber, graduationYear } = req.body;

  // check if user already exists
  const check = await User.create({
    firstname,
    lastname,
    email,
    password,
    matricNumber,
    program,
    graduationYear,
  });

  // if user already exists
  if (check[0]) {
    // set the session
    req.session.user = check[1];
    // redirect to dashboard
    res.redirect("/");
  } else {
    res.redirect("/signup");
  }
});

/**
 * @desc show login page
 * @route GET /login
 */
router.get("/login", async (req, res) => {
  // setthe session
  const currentUser = await userInSession(req);
  const error = req.flash("error");

  render(res, "Login", { error, response: {
      data: {},
      currentUser,
      result: false,
    },
  });
});

/**
 * @desc handle login click
 * @route POST /login
 */
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

/**
 * @desc show profile page
 * @route GET /profile
 */
router.get("/profile", async (req, res) => {
  try {
      
    const currentUser = await userInSession(req);

      // get user details from database
      render(res, "ProfileDetail", { 
         response: {
            data: {
              programs, 
              graduationYears 
            },
            currentUser,
            result: true,
          message: "Profile retrieval successful",  
      }});
  } catch (err) {
    console.error(err);
  }
});

/**
 * @desc handle update profile click
 * @route POST /profile
 */
router.post("/profile", isLoggedIn, multerUploads, async (req, res) => {

  if(req.fileValidationError){
   
    render(res, "ProfileDetail", { 
      response: {
        data: {
          programs, 
          graduationYears 
        },
        currentUser: req.session.user,
        result: false,
        message: "Please upload a valid file. Images usually have .jpg or .png extensions.",  
      }});

  } else {
    const currentUser = await userInSession(req);

    const { firstName, lastName, graduationYear, program } = req.body;

    // reset graduation year and program if user does not select
    if (graduationYear === "Select Graduation Year") {
      graduationYear = "";
    }
    if (program === "Select Program") {
      program = "";
    }

    try {
      // create a new user detail with the information provided from the request
      const newUserProfile = {
        program,
        graduationYear,
        firstName,
        lastName,
        profilePicture: currentUser?.profilePicture,
        ...req.body,
      };

      // it there is a file
      if (req.file) {
        // Upload image to cloudinary
        await cloudinary.uploader.upload(
          req.file.path,
          function (error, result) {
            // if upload is successful
            if (result) {
              // // set the new user image to url
              newUserProfile.profilePicture = result.url;
              return newUserProfile.profilePicture;
            } else {
              // if upload is unsuccessful
              console.log(error);
            }
          }
        );
      }

      // update current user with new detail
      const result = await User.updateUser(currentUser._id, newUserProfile);

      // if update is successful
      if (result[0]) {
        // redirect to profile page
        res.redirect("/profile");
      }
    } catch (err) {
      console.error(err);
    }
  }

});

// @desc Changes the Password of a user
// @desc Log out a user
// @route GET /logout
router.get("/logout", isLoggedIn, (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/");
});

module.exports = router;
