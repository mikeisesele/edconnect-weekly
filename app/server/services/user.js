const User = require("../models/user");
const helper = require("../models/mongo_helper");

const capitalizedName = (name) => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

/* Creates new user */
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
    user.email = email;
    user.matricNumber = matricNumber;
    user.program = program;
    user.graduationYear = graduationYear;
    user.facebookId = facebookId;
    user.googleId = googleId;
    user.profileImage = profileImage;
    user.setPassword(password);

    let sUser = await User.findOne({ email: user.email });

    if (sUser) {
      return [true, sUser];
    } else await user.save();
    {
      return [true, user];
    }
  } catch (e) {
    return [false, helper.translateError(e)];
  }
};

/* Authenticate a user */
const authenticate = async (email, password) => {
  // create an object to auth a user
  const user = new User();
  user.email = email;
  user.password = password;

  // use the email to find that user
  const result = await User.findOne({ email: email });

  // if the user exists, check the password
  // verify the password of the user
  return result && user.validPassword(result, password)
    ? [true, result]
    : [false, ["Invalid email/password"]];
};

/* Return user with specified id */
const getById = async (id) => {
  const user = await User.findById(id);
  return user;
};

/* Return all users */
const getAll = () => {
  // populate users with data from file.
  return User.find({});
};

const getUserByEmail = async (email) => {
  try{
    let user = await User.findOne({ email: email });

    if (user) {
      return [true, user];
    } else  {
      return [false, "this email is not associated with any user in our database"];
    }
  } catch (e) {
    return [false, helper.translateError(e)];
  }
}

const getBySocialId = async (social, id) => {
  switch (social) {
    case "facebook":
      return await User.findOne({ facebookId: id });

    case "google":
      return await User.findOne({ googleId: id });
  }
};

const updateUser = async (id, user) => {
  try {
    const thisUser = await User.findById(id);

    if (thisUser) {
      await thisUser.updateOne({ ...user });
      const updatedUser = await User.findById(id);
      return [true, updatedUser];
    }
  } catch (e) {
    return [false, helper.translateError(e)];
  }
};

const confirmPassword = async (id, password) => {
  // logic to confirm the password of a user using id
  try {
    const thisUser = await User.findById(id);

    if (thisUser) {
      return thisUser.validPassword(thisUser, password)
        ? [true, thisUser] : [false, ["Invalid password"]];
    }
  } catch (e) {
    return [false, helper.translateError(e)];
  }
};

const updatePassword = async (id, password) => {
  // logic to update the password of a user using id
  try {
    const thisUser = await User.findById(id);
    await thisUser.setPassword(password);
    // thisUser.passwordToken = "";
    thisUser.save();
  } catch (e) {
    return [false, helper.translateError(e)];
  }
};

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
};
