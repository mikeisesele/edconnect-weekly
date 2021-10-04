const express = require("express");
const passport = require("passport");
const router = express.Router();
/**
 * @desc handles all errors and redirects to the error page
 * @route GET /error
 */
router.get("/error", (req, res) => res.send("Unknown Error"));


/**
 * @desc handles faebook authorization
 * @route GET /auth/facebook
 */
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

/**
 * @desc facebook auth callback
 * @route GET /auth/facebook/callback
 */
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: false,
  }),

  function (req, res) {
    const { user } = req;
    /**
     * @desc creates a new user if one does not exist
     */
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
      console.log(`no user ${req.session.user}`);
    }
  }
);

module.exports = router;
