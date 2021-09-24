const express = require("express");
const router = express.Router();
const User = require("../services/user");
const Project = require("../services/project");
const isLoggedIn = require("../middlewares/auth");

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
