const express = require('express');
const router = express.Router();
const project = require("../services/project")


router.get('/', async (req, res) => {

  try {
  const projects = await project.getAll();
  const user = req.session.user;
  
  res.render('Home', {props: projects, us: user})

  } catch (err) {
    console.log(err)
  }

});

router.get('/logout', (req, res) => {

  req.session.destroy();
  res.redirect("/");
});

module.exports = router;