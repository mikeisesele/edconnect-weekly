const express = require("express");
const router = express.Router();
const project = require("../services/project");

/**
 * @desc homepage route
 * @route GET /
 */
router.get("/", async (req, res) => {
  const projects = await project.getAll();

  const user = req.session.user;
  return res.render("Home", { props: projects, user: user });
});


/**
 * @desc Logout user
 * @route GET /logout
 */
router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
