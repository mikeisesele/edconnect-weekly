const User = require("../models/user");
const helper = require("../models/mongo_helper");

/**
 * @desc Capitalizes the first letter of a name
 */
const capitalizedName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

/**
 * @desc  Creates a user
 */
const create = async ({
  firstname,
  lastname,
  email,
  password,
  matricNumber,
  program,
  graduationYear,
  facebookId,
  googleId,
  profileImage,
}) => {
  try {

    const user = new User();

    user.firstName = capitalizedName(firstname);
    user.lastName = capitalizedName(lastname);
    user.email = email.toLowerCase();
    user.matricNumber = matricNumber;
    user.program = program;
    user.graduationYear = graduationYear;
    user.facebookId = facebookId;
    user.googleId = googleId;
    user.profileImage = profileImage;
    user.setPassword(password);

    // find if the user already exists
    const isUser = await User.findOne({ email: user.email });

    // if the user does not exist, save the user
    if (!isUser) {
      // save the user
      const savedUser = await user.save();
      return [true, savedUser];
    } else {
      // if the user exists, return an error
      return [false, "A user with that email already exists"];
    }
  } catch (e) {
    return [false, helper.translateError(e)];
  }
};

/**
 * @desc Authenticates a user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @returns {object} - The user object
 * @returns {boolean} - Whether the user was authenticated or not
 */
const authenticate = async (email, password) => {
  // create an object to auth a user
  const user = new User();
  user.email = email.toLowerCase()
  user.password = password;

  // use the email to find that user
  const result = await User.findOne({ email: email });

  // if the user exists, check the password
  // verify the password of the user
  return result && user.validPassword(result, password)
    ? [true, result]
    : [false, ["Invalid email/password"]];
};

/**
 * @desc gets a user by id
 * @param {string} id - The id of the user
 */
const getById = async (id) => {
  const user = await User.findById(id);
  return user;
};

/**
 * @desc Gets all users
 * @returns {Array} - Array of the users object 
 */
const getAll = () => {
  // populate users with data from file.
  return User.find({});
};

/**
 * @desc  Gets a user by email
 * @param {string} email - The email of the user
 * @returns {object} - The user object
 */
const getUserByEmail = async (email) => {
  try {
    // find the user by email
    let user = await User.findOne({ email: email });

    // if the user exists, return the user
    if (user) {
      return [true, user];
    } else {
      // if the user does not exist, return an error
      return [false, "this email is not associated with any user in our database"];
    }
  } catch (e) {
    return [false, helper.translateError(e)];
  }
}

/**
 * @desc  Gets a user by id 
 */
const getBySocialId = async (social, id) => {
  // logic to get a user by social id 
  switch (social) {
    // if the social is facebook
    case "facebook":
      // find the user by facebook id 
      return await User.findOne({ facebookId: id });

    // if the social is google
    case "google":
      // find the user by google id
      return await User.findOne({ googleId: id });
  }
};

/**
 * @desc Updates a user by id
 * @param {string} id - The id of the user
 * @param {object} user - The user object
 * @returns {object} - The user object
 */
const updateUser = async (id, user) => {
  try {
    // find the user by id
    const thisUser = await User.findById(id);

    // if the user exists, update the user 
    if (thisUser) {
      await thisUser.updateOne({ ...user });
      const updatedUser = await User.findById(id);
      return [true, updatedUser];
    }
  } catch (e) {
    return [false, helper.translateError(e)];
  }
};

/**
 * @desc confirms if a user password is correct  
 * @param {string} id - The id of the user
 * @param {string} password - The password of the user
 */
const confirmPassword = async (id, password) => {
  // logic to confirm the password of a user using id
  try {
    // find the user by id
    const thisUser = await User.findById(id);

    // if the user exists, check the password
    if (thisUser) {
      // verify the password of the user
      // return the user if the password is correct
      return thisUser.validPassword(thisUser, password)
        ? [true, thisUser] : [false, ["Invalid password"]];
    }
  } catch (e) {
    return [false, helper.translateError(e)];
  }
};

/**
 * @desc updates a user's password
 * @param {string} id - The id of the user
 * @param {string} password - The password of the user
 * @returns {object} - The user object
 */
const updatePassword = async (id, password) => {
  // logic to update the password of a user using id
  try {
    // find the user by id
    const thisUser = await User.findById(id);
    // if the user exists, update the password
    await thisUser.setPassword(password);
    // save the user
    thisUser.save();
  } catch (e) {
    return [false, helper.translateError(e)];
  }
};


/**
 * @desc  Save a project as a user favourite
 * @param {string} id - The id of the user
 * @param {string} projectId - The id of the project
 */
const addFavouriteProject = async (id, projectId) => {
  try {
    // find the user by id
    const thisUser = await User.findById(id);
    thisUser.favouriteProjects.push(projectId);
    await thisUser.save();
  } catch (e) {
    return [false, helper.translateError(e)];
  }
}

/**
 * @desc  Remove a project as a user favourite
 * @param {string} id - The id of the user
 * @param {string} projectId - The id of the project
 */
const removeFromFavouriteProjects = async (id, projectId) => {
  try {
    // find the user by id
    const thisUser = await User.findById(id);
    thisUser.favouriteProjects.pull(projectId);
    await thisUser.save();
  } catch (e) {
    return [false, helper.translateError(e)];
  }
}

/**
 * @desc Returns a user's favourite projects
 * @param {string} id - The id of the user
 * @returns {Array} - Array of the projects object
 * @returns {boolean} - Whether the user's favourite projects were found or not
 * @returns {string} - The error message
 * @returns {object} - The user object
 */
const getFavouriteProjects = async (id) => {
  try {
    // find the user by id
    const thisUser = await User.findById(id);
    // if the user exists, return the user's favourite projects

    const projects = await User.aggregate([
      {
        $lookup: {
          from: "projects",
          localField: "favouriteProjects",
          foreignField: "_id",
          as: "favourites",
        }, 
      },
      
      // Deconstructs the array field from the
      // input document to output a document
      // for each element
      // {
      //   $unwind: "$favouriteProjects",
      // },
    ]).then((projects) => {
      return projects 
    });

     if (projects) {
       return [true, projects];
     } else {
       return [false, "Projects not found"];
     }


  } catch (e) {
    return [false, helper.translateError(e)];
  }
}

module.exports = {
  create,
  authenticate,
  getById,
  getAll,
  getBySocialId,
  getUserByEmail,
  updateUser,
  confirmPassword,
  updatePassword,
  addFavouriteProject,
  removeFromFavouriteProjects,
  getFavouriteProjects,
};
