const express = require("express");
const router = express.Router();
const project = require("../services/project");
const DB = require("../config/db");

// @desc homepage route
// @route GET /
// the facebook callback is  used to get access the homepage
router.get("/", async (req, res) => {
  const projects = await project.getAll();
  
      const user = req.session.user;
      return res.render("Home", { props: projects, user: user }); 
});

// @desc Logout user
// @route /logout
router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
