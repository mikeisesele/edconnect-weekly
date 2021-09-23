const express = require("express");
const { getPrograms, getGradYears } = require("../services/school");
const User = require("../services/user");
const isLoggedIn = require("../middlewares/auth");
const multerUploads = require("../middlewares/multer");
const router = express.Router();
const jwt = require("jwt-simple");
import sendMail from "../services/mailService";


/**
 * @desc change current password by edit from profile page
 * @route POST /api/v1/password/change
 * @access private 
 */
router.post("/api/v1/password/change", async (req, res) => {
  // function to render pages
  const render = (page, message) => {
    res.render(page, { message });
  };

  try {
    const userId = req.session.user._id;
    const user = await User.getById(userId);
    // check if user registered with email or social media
    // if email then check if password is correct
    if (!user.provider) {
      const currentPassword = req.body.currentPassword;
      const newPassword = req.body.newPassword;
      // check if current password is correct
      const confirmPasswordResponse = await User.confirmPassword(
        userId,
        currentPassword
      );
      // if current password is correct
      if (confirmPasswordResponse[0]) {
        // update password
        await User.updatePassword(id, newPassword);
        res.redirect("/profile");
      } else {
        // if current password is incorrect then render page with error message
        render("ProfileDetail", "Current password is incorrect");
      }
    } else {
      // if user registered with social media then render page with error message
      switch (user.provider) {
        // if user registered with facebook
        case "google":
          // render page with error message
          "account was created with google";
          res.redirect(303, "/profile");
          break;
          // if user registered with facebook
        case "facebook":
          // render page with error message
          "account was created with facebook";
          res.redirect(303, "/profile");
          break;
      }
    }
  } catch (e) {
    console.log(e.message);
  }
});

/**
 * @desc request reset password route
 * @route POST /api/passwordReset/sendEmailToken
 */
router.post("/api/passwordReset/sendEmailToken", async (req, res) => {
  const render = (page, message) => {
    res.render(page, { message });
  };

  try {
    // get user email from request body 
    if (req.body) {
      if (req.body.email) {
        var emailAddress = req.body.email;

        // check if user exists
        const user = await User.getUserByEmail(emailAddress);

        // if user exists then send email token
        if (user[0]) {
          // gget user credentials
          const id = user[1]._id;
          const hash = user[1].password;
          const email = user[1].email;
          const createdAt = user[1].createdAt;

          // create token for user using user credentials
          const payload = { id, email };
          const jwtsecret = hash + `-` + createdAt;
          const token = jwt.encode(payload, jwtsecret);
          const link = `${payload.id}/${token}`;

          /**
           * @desc send email token to user
           * @param {string} emailAddress - user email 
           * @param {string} link - token
           * @returns {string} message - success or error message
           */
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

/**
 * @desc display the pageto input new password 
 * @route GET /api/passwordReset/:id/:token
 * @Param {string} id - user id 
 * @Param {string} token - token
 */
router.get("/api/passwordReset/:id/:token", async (req, res) => {
  const render = (page, message) => {
    res.render(page, message);
  };

  // Using the ID from the URL parameters, we fetch and validate that the user exists in our database.
  const id = req.params.id;
  const paramsToken = req.params.token;

  // get user by id
  const user = await User.getById(id);
  if (user) {
    // Decrypt one-time-use token using the user's
    // current password hash from the database and combine it
    // with the user's created date to make a very unique secret key.
    const createdAt = user.createdAt;

    // get user password hash from database and combine it with user created date
    // this will make the token a one time token since changing the password will change the hash
    const hash = user.password;
    const jwtsecret = hash + `-` + createdAt;
    const payload = jwt.decode(paramsToken, jwtsecret);
    const payloadId = payload.id;
    const token = { payloadId, paramsToken };

    render("ResetPassword", { token });
  }
});

/**
 * @desc update user password
 * @route POST /api/passwordReset/:id/:token
 */
router.post("/api/passwordReset", async (req, res) => {
  const render = (page, message) => {
    res.render(page, message);
  };

  try {
    // Fetch user from database using id and token
    const id = req.body.id;
    const token = req.body.token;
    const newPassword = req.body.confirmpassword;

    // get user by id
    const user = await User.getById(id);

    if (user) {
      // Decrypt one-time-use token using the user's
      // current password hash from the database and combining it
      const hash = user.password;
      const createdAt = user.createdAt;
      const jwtsecret = hash + `-` + createdAt;
      try {
        // Decode the token and check if it's valid and not expired using the secret key
        const payload = jwt.decode(token, jwtsecret);
        const id = payload.id;
      } catch (err) {
        console.log(err);
        render("ResetPassword", { message: "Invalid token" });
      }

      // if token is valid then update password
      if (id == user._id) {
        // check if new password is same as confirm password 
        if (user.validPassword(user, newPassword)) {
          
          res.render("ResetPassword", {
            error:
              "Your cannot use your last pasword anymore. Please change it.",
          });
        } else {
          // update password
          user.setPassword(newPassword);
          user.save();

          render("ResetPassword", {
            message: "Your password has been successfully changed.",
          });
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
});
