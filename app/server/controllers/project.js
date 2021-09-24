const express = require("express");
const router = express.Router();
const Project = require("../services/project");
const User = require("../services/user");
const isLoggedIn = require("../middlewares/auth");

/**
 * @desc function to render pages with data
 */
const render = (res, page, message) => {
  res.render(page, message);
};

/**
* @desc function to get a user from the session
*/
const userInSession = async (req) => {
  const userId = req?.session?.user ? req.session.user._id : null
  let user = {}
  if (userId != null) {
    user = await User.getById(userId);
  }
  return user
}

/**
 * @desc renders the create project page if a user is in session.
 * @route GET /project.
 */
router.get("/project/create", isLoggedIn, async (req, res) => {
  let currentUser = await userInSession(req);
  const error = req.flash("error");

  !currentUser
    ? res.redirect("/login")
    : render(res, "CreateProject", {
      response: {
        data: {
          project: {},
        },
        currentUser,
        result: "create",
        message: "",
        error,
      },
    });
});

/**
 * @desc handles the post request to create a project.
 * @route POST /projects/submit
 */
router.post("/projects/submit", isLoggedIn, async (req, res) => {
  const tags = req.body.tags.split(",");
  const authors = req.body.authors.split(",");
  const { name, abstract } = req.body;
  let currentUser = await userInSession(req);
  const authorImage = currentUser.profileImage;
  const createdBy = currentUser._id
  const error = req.flash("error");

  let createdProject = await Project.create({
    name,
    abstract,
    authors,
    tags,
    createdBy,
    authorImage,
  })

  createdProject[0]
    ? res.redirect("/")
    : render(res, "CreateProject", {
      response: {
        data: {
          project: {},
        },
        currentUser,
        error
      },
    });

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
    const projectCreator = await User.getById(userId);
    let currentUser = await userInSession(req);
    const authorImage = projectCreator.profilePicture;
    const error = req.flash("error");

    if (!project) {
      res.redirect("/")
    }
    else {
      render(res, "Project", {
        response: {
          data: {
            project,
            projectCreator,
            authorImage,
          },
          currentUser,
          error,
          status: true,
          message: "data retrived successfully",
        },
      });
    }

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
router.get("/editproject/:id/:creatorId", isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    const creatorId = req.params.creatorId;
    const project = await Project.getById(id);
    const user = await User.getById(creatorId);
    let currentUser = await userInSession(req)

    project && user
      ? render(res, "CreateProject", {
        response: {
          data: {
            project: project,
            user: user,
          },
          currentUser,
          result: "edit",
          message: "data retrived successfully",
        },
      })
      : render(res, "CreateProject", {
        response: {
          data: {},
          currentUser,
          result: false,
          message: "Project not found.",
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
router.get("/delete/:id/:creatorId", isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.getById(id);
console.log(project)
    // delete project by id
    await Project.deleteProject(project);
    res.redirect("/projects/mine");
    
  } catch {
    (error) => console.log(error);
  }
});


/**
 * @desc handles the route to search for any text in the project,
 * @route GET /search/:text
 * @param {string} text - the text to search for.
 * @param {string} creatorId - the id of the creator of the project.
 */
router.get("/search/:text", async (req, res) => {
  
  try {
    const text = req.params.text;
    const projects = await Project.search(text);
    
    let currentUser = await userInSession(req);
    const error = req.flash("error");

    // render the page with the data retrieved
    projects
      ? render(res, "AllProjects", {
        response: {
          data: {
            projects,
          },
          currentUser,
          error,
          status: true,
          message: "data retrived successfully",
        },
      })
      : render(res, "AllProjects", {
        response: {
          data: {},
          currentUser,
          error,
          status: false,
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
router.post("/projects/update/:id", isLoggedIn, async (req, res) => {

  try {
    const id = req.params.id;
    let currentUser = await userInSession(req);

    const { projectName, abstract, authors, tags } = req.body;

    const project = {
      name: projectName,
      abstract: abstract,
      authors: authors,
      tags: tags,
    };

    const updatedProject = await Project.updateProject(id, project);

    updatedProject[0]
      ? render(res, "Project", {
        response: {
          data: {
            project: updatedProject[1],
          },
          currentUser,
          result: true,
          message: "project updated successfully",
        },
      })
      : render(res, "Project", {
        response: {
          data: {},
          currentUser,
          result: false,
          message: "Project update failed",
        },
      });
  } catch {
    (error) => console.log(error);
  }
});

/**
 * @desc handles the post request to get all projects createdby the user (display for view).
 * @route GET /projects/mine
 * @param {string} id - the id of the user.
 */
router.get("/projects/mine", isLoggedIn, async (req, res) => {
  let currentUser = await userInSession(req);
  const projects = await Project.findByCreatedBy(currentUser);

  projects
    ? render(res, "UserProjects", {
      response: {
        data: {
          projects,
        },
        result: true,
        currentUser,
        message: "All project retrieved",
      },
    })
    : render(res, "UserProjects", {
      response: {
        data: {
          project: {},
        },
        currentUser,
        result: false,
        message: "Project retrieval failed",
      },
    });
});

/**
 * @desc handles the post request to get all projects  (display for view).
 * @route GET /projects/all
 * @param {string} id - the id of the user.
 */
router.get("/projects/all", async (req, res) => {
  const projects = await Project.getAll();
  let currentUser = await userInSession(req);

  projects
    ? render(res, "AllProjects", {
      response: {
        data: {
          projects,
        },
        result: true,
        currentUser,
        message: "All user project retrieved",
      },
    })
    : render(res, "AllProjects", {
      response: {
        data: {
          project: {},
        },
        currentUser,
        result: false,
        message: "Project retrieval failed",
      },
    });
});


module.exports = router;
