const express = require("express");
const passport = require("passport");
const router = express.Router();


const auth = (req, res)=>{
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
    } else {
      res.redirect("/");
    }
}

/**
 * @desc handles all errors and redirects to the error page
 * @route GET /error
 */
router.get("/error", (req, res) => res.send("Unknown Error"));


// @desc Auth with Google
// @route GET /auth/google
// the "google" is used because we want to auth with google. for facebook or twitter, use "facebook" or "twitter"
// the scope is used to define what we want to access from google.
// the email is used to get the email of the user.
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


/**
 * @desc handles faebook authorization
 * @route GET /auth/facebook
 */
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);


// @desc Google auth callback
// @route GET /auth/google/callback
// the google callback is  used to get the user data from google.
router.get(
  "/auth/google/callback",
  passport.authenticate(
    "google", { failureRedirect: "/" }),
  function (req, res) {
    auth(req,res);
  }
);

/**
 * @desc facebook auth callback
 * @route GET /auth/facebook/callback
 */
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/",
    session: false,
  }),

  function (req, res) {
    auth(req,res);
  }
)

module.exports = router;
