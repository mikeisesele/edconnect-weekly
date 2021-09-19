// ensure that only an anthenticated user can access desired route
const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.status(401).send("Not Logged In");
    res.redirect("/");
  }
};

module.exports = isLoggedIn;
