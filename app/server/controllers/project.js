const express = require("express");
const router = express.Router();
const Project = require("../services/project");
const User = require("../services/user");
const ObjectId = require("mongodb").ObjectId; 

router.get("/project", (req, res) => {
  const error = req.flash("error");
  const user = req.session.user;
  if (!user) {
    res.redirect("/login");
  } else {
    res.render("CreateProject", { err: error, user: req.session.user });
  }
});

router.get("/projects/submit", (req, res) => {
  const user = req.session;
  const error = req.flash("error");

  if (!user) {
    res.redirect("/login");
  } else {
    res.render("CreateProject", { err: error, user: user });
  }
});

router.post("/projects/submit", async (req, res) => {
  const tags = req.body.tags.split(",");
  const authors = req.body.authors.split(",");
  const { name, abstract } = req.body;
  const createdBy = req.session.user._id;
  const user = await User.getById(createdBy);
  const authorImage = user.profileImage;

  const check = await Project.create({
    name,
    abstract,
    authors,
    tags,
    createdBy,
    authorImage,
  });

  if (check[0]) {
    res.redirect("/");
  } else {
    req.flash("error", check[1]);
    res.redirect(303, "/projects/submit");
  }
});

router.get("/project/:id", async (req, res) => {
  try {
  const projectId = req.params.id;
  var id = new ObjectId(projectId);
  const project = await Project.getById(id);
  const userId = project.createdBy;
  const user = await User.getById(userId);
  const projectCreator = { firstName: user.firstName, lastName: user.lastName };
  const authorImage = project.authorImage;

  const projectResponse = {
    project,
    projectCreator,
    authorImage,
    user
  };

  if (!project) {
    res.redirect("/");
  }
  
  res.render("Project", { projectResponse });
} catch (error){
  console.log(error);
}
});

module.exports = router;
