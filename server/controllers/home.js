const express = require("express");
const router = express.Router();
const User = require("../services/user");
const Project = require("../services/project");
const isLoggedIn = require("../middlewares/auth");
const path = require('path')
const userInSession = require("../../utils/userInSession");
const render = require("../../utils/renderView");

/**
 * @desc homepage route
 * @route GET /
 */
router.get("/", async (req, res) => {
  const projects = await Project.getAll();

  let currentUser = await userInSession(req);
  
  render(res, "Home", {
    response: {
      data: {
        projects,
      },
      currentUser,
      result: false,
      message: "Project retrieval successful",
    },
  });
});


router.get("/google1535bcdb47837425.html", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../views/google1535bcdb47837425.html")
  );
});
        
/**
 * @desc Logout user
 * @route GET /logout
 */
router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
