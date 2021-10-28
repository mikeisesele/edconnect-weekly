const User = require("../server/services/user");

/**
 * @desc function to get a user from the session
 */
module.exports = async (req) => {
  const userId = req?.session?.user ? req.session.user._id : null;
  let user = {};
  if (userId != null) {
    user = await User.getById(userId);
  }
  return user;
};
