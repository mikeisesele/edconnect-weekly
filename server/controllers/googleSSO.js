const express = require("express");
const passport = require("passport");
const router = express.Router();

// @desc Auth with Google
// @route GET /auth/google
// the "google" is used because we want to auth with google. for facebook or twitter, use "facebook" or "twitter"
// the scope is used to define what we want to access from google.
// the email is used to get the email of the user.
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @desc Google auth callback
// @route GET /auth/google/callback
// the google callback is  used to get the user data from google.
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    const { user } = req;
    if (user) {
      req.session.user = user;
      if (
        user.graduationYear == null &&
        user.matricNumber == null &&
        user.program == null
      ) {
        res.redirect("/profile");
      } else {
        res.redirect("/");
      }
    }
  }
);

module.exports = router;
