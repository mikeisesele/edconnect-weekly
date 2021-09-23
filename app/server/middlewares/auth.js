
/**
 * @desc ensure that only an anthenticated user can access desired route
 */
const isLoggedIn = (req, res, next) => {
  // if user is authenticated in the session, carry on
  if (req.user) {
    next();
  } else {
    // if they aren't redirect them to the home page
    res.redirect("/");
  }
};

module.exports = isLoggedIn;
