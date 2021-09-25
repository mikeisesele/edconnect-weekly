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
        result: "Create",
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
 * @desc handles the get request to retrieve a project and its creator for view and edit.
 * @route GET /editproject/:id/:creatorId
 * @param {string} id - the id of the project.
 * @param {string} creatorId - the id of the creator of the project.
 */
router.get("/editproject/:id", isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.getById(id);
    const user = await User.getById(project.createdBy);
    let currentUser = await userInSession(req)


    render(res, "EditProject", {
      response: {
        data: {
          project,
          user
        },
        currentUser,
        message: "data retrived successfully",
      },
    })
  } catch {
    (error) => console.log(error);
  }
});


/**
 * @desc handles the get request to retrieve a project and its creator for delete.
 * @route GET /deleteproject/:id/:creatorId
 * @param {string} id - the id of the project.
 * @param {string} creatorId - the id of the creator of the project.
 */
router.get("/deleteproject/:id", isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.getById(id);

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
router.post("/editproject/project/update/:id", isLoggedIn, async (req, res) => {
  try {
    const id = req.params.id;
    let currentUser = await userInSession(req);

    const { name, abstract, authors, tags } = req.body;

    const project = {
      name,
      abstract,
      authors,
      tags
    };

    const updatedProject = await Project.updateProject(id, project);

    if (updatedProject[0]) {
      res.redirect(`/project/${id}`);
    }


  } catch {
    (error) => console.log(error);
  }
});

/**
 * @desc adds a project as favourite for a user
 * @Route POST /projects/favourite/:id
 */
router.get("/favourites/add/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.getById(id);
    const user = await userInSession(req);

    // add project to the user favourite projects
    await User.addFavouriteProject(user._id, project._id);
  } catch {
    (error) => console.log(error);
  }
});

/** 
 * @desc handles the route to delete a specific project from a user list of favourites.
 * @Route POST /projects/delete/:id
 * @param {string} id - the id of the project.
 * @param {string} userId - the id of the user.
*/
router.get("/favourites/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userInSession(req);
    const project = await Project.getById(id);

    // delete project from the user favourite projects
    await User.removeFromFavouriteProjects(user._id, project._id);
    res.redirect("/projects/favourites");

  } catch {
    (error) => console.log(error);
  }
});


/**
 * @desc handles the route to get all the favourite projects of a user.
 * @Route GET /projects/favourites
 * @param {string} userId - the id of the user.
 */
router.get("/projects/favourites", async (req, res) => {
  try {
    const currentUser = await userInSession(req);
    const userObject = await User.getFavouriteProjects(currentUser._id);

    userObject[1].forEach((projects) => {
     
      if (projects._id.toString() === currentUser._id.toString()) {
       
        render(res, "Favourites", {
          response: {
            data: projects.favourites,
            currentUser
          }          
         })
      }
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
