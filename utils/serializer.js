const passport = require("passport");
const User = require("../server/services/user");


/**
 * @Desc serialize user into the session and deserialize user from the session
 */
const serializeUser = passport.serializeUser((user, done) => {
  done(null, user.id);
});

const deserializeUser = passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

module.exports = {
  serializeUser,
  deserializeUser,
};