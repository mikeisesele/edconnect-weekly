import User from "../models/user"
import helper from '../models/mongo_helper';

/* Creates new user */
const create = async ({
  firstname,
  lastname,
  email,
  password,
  matricNumber,
  program,
  graduationYear,
}) => { 
    try {

      const user = new User()

      user.firstName = firstname;
      user.lastName = lastname;
      user.email = email;
      user.matricNumber = matricNumber;
      user.program = program;
      user.graduationYear = graduationYear;
      user.setPassword(password);
      
      if (await user.save()) {
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
    return result && user.validPassword(result, result.password) ? [true, result] : [false, ["Invalid email/password"]];  
};

/* Return user with specified id */
const getById = (id) => {
  return User.findById(id);
};

/* Return all users */
const getAll = () => {
  // populate users with data from file.
  return User.find({});
};

module.exports = {
  create,
  authenticate,
  getById,
  getAll,
};
