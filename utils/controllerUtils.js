const User = require("../server/services/user");

/**
 * @desc function to render pages with data
 */

exports.render = (res, page, message) => {
  res.render(page, message);
};

/**
 * @desc function to get a user from the session
 */
exports.userInSession = async (req) => {
  const userId = req?.session?.user ? req.session.user._id : null;
  let user = {};
  if (userId != null) {
    user = await User.getById(userId);
  }
  return user;
};
