const express = require("express");
const router = express.Router();
const Project = require("../services/project");
const User = require("../services/user");

/**
 * @desc renders the create project page if a user is in session.
 * @route GET /project.
 */
router.get("/project", (req, res) => {
  const user = req.session.user;
  !user
    ? res.redirect("/login")
    : res.render("CreateProject", {
        response: {
          data: {
            project: {},
            user: user,
          },
          result: true,
          message: "",
        },
      });
});

/**
 * @desc handles the post request to create a project.
 * @route POST /projects/submit
 */
router.post("/projects/submit", async (req, res) => {
  const tags = req.body.tags.split(",");
  const authors = req.body.authors.split(",");
  const { name, abstract } = req.body;
  const createdBy = req.session.user._id;
  const user = await User.getById(createdBy);
  const authorImage = user.profileImage;

  const createdProject = await Project.create({
    name,
    abstract,
    authors,
    tags,
    createdBy,
    authorImage,
  });

  createdProject[0] ? res.redirect("/") : console.log(createdProject[1]),
    res.redirect("/projects/submit");
});

/**
 * @desc handles the post request to get a specific project (display for view).
 * @route GET /project/:id
 * @param {string} id - the id of the project.
 */
router.get("/project/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.getById(id);
    const userId = project.createdBy;
    const user = await User.getById(userId);
    const projectCreator = {
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const authorImage = user.profilePicture;

    const projectResponse = {
      projectCreator,
      authorImage,
      user,
    };

    !project
      ? res.redirect("/")
      : res.render("Project", {
          response: {
            data: {
              project: project,
              user: user,
              projectResponse: projectResponse,
            },
            result: true,
            message: "data retrived successfully",
          },
        });
  } catch {
    (error) => console.log(error);
  }
});

/**
 * @desc handles the get request to retrieve a project and its creator for edit.
 * @route GET /editproject/:id/:creatorId
 * @param {string} id - the id of the project.
 * @param {string} creatorId - the id of the creator of the project.
 */
router.get("/editproject/:id/:creatorId", async (req, res) => {
  try {
    const id = req.params.id;
    const creatorId = req.params.creatorId;
    const project = await Project.getById(id);
    const user = await User.getById(creatorId);

    project && user
      ? res.render("CreateProject", {
          response: {
            data: {
              project: project,
              user: user,
            },
            result: true,
            message: "data retrived successfully",
          },
        })
      : res.render("CreateProject", {
          response: {
            data: {},
            result: false,
            message: "Project not found.",
          },
        });
  } catch {
    (error) => console.log(error);
  }
});

/**
 * @desc handles the post request to update a project after edit.
 * @route POST /projects/update/:id
 * @param {string} id - the id of the project.
 */
router.post("/projects/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.session.user._id;
    const user = await User.getById(userId);
    const { projectName, abstract, authors, tags } = req.body;

    const project = {
      name: projectName,
      abstract: abstract,
      authors: authors,
      tags: tags,
    };
    const updatedProject = await Project.updateProject(id, project);

    updatedProject[0]
      ? res.render("Project", {
          response: {
            data: {
              project: updatedProject[1],
              user: user,
            },
            result: true,
            message: "project updated successfully",
          },
        })
      : res.render("Project", {
          response: {
            data: {},
            result: false,
            message: "Project update failed",
          },
        });
  } catch {
    (error) => console.log(error);
  }
});

/**
 * @desc handles the post request to get all projects liked and createdby the user (display for view).
 * @route GET /personalprojects/:id
 * @param {string} id - the id of the user.
 */
router.get("/personalprojects/:id", async (req, res) => {});

module.exports = router;
