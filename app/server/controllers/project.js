const express = require('express');
const router = express.Router();
const {create, getById} = require("../services/project")
const user = require("../services/user")

router.get('/project', (req, res) => {    
  
  const error = req.flash("error");    

  if(!req.session.user){
    res.redirect("/login")
  } else {
    res.render("CreateProject", { err: error, us: req.session.user});
  }
});

router.get('/projects/submit', (req, res) => {    
  const error = req.flash("error");    
  
  if(!req.session.user){
    res.redirect("/login")
  } else {
    res.render("CreateProject", { err: error, user: req.session.user});
  }

  });
  

router.post('/projects/submit', async (req, res) => {

    const tags = req.body.tags.split(",");
    const authors = req.body.authors.split(",");
    const {name, abstract} = req.body;
    const createdBy = req.session.user._id;

    const check = await create({name, abstract, authors, tags, createdBy})

    if (check[0]){
      res.redirect("/");
    }

    else{
      req.flash("error", check[1]);
      res.redirect(303, '/projects/submit');
    } 
});

// this is an example of route handler
router.get('/project/:id', async (req, res) => {

  
  const check = await getById(req.params.id)
  res.render("Project", {userSession: req.session.user, userParams: check, userName: await user.getById(check.createdBy)});
  
});

module.exports = router;