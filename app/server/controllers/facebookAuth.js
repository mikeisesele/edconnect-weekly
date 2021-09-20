const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/auth/error", (req, res) => res.send("Unknown Error"));

// @desc Auth with Facebook
// @route GET /auth/facebook
// the "facebook" is used because we want to auth with facebook.
// the scope is used to define what we want to access from facebook.
// the email is used to get the email of the user.
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// @desc facebook auth callback
// @route GET /auth/facebook/callback
// the facebook callback is  used to get the user data from facebook.
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),

 function (req, res) {
    const { user } = req;
    req.session.user = user[1];
    res.redirect("/profile");
  }

);

module.exports = router;
