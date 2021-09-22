require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../services/user");

const userGoogleCertificates = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

const userGoogleProfile = async (accessToken, refreshToken, profile, done) => {
  try {
    //checks if user with provider (= google) id exist in the db
    const checkUser = await User.getBySocialId(profile.provider, profile.id);

    // if user already exist return object
    if (checkUser) {
      done(null, checkUser);
    }

    //if user does not yet exist register with data returned by provider's authenticator
    if (!checkUser) {
      const userDetail = {
        firstname: profile._json.given_name,
        lastname: profile._json.family_name,
        password: profile._json.sub,
        email: profile._json.email,
        googleId: profile._json.sub,
        profileImage: profile._json.picture,
        provider: profile.provider,
      };

      //create user
      const createdUser = await User.create(userDetail);

      if (createdUser[0]) {
        done(null, createdUser[1]);
      } else {
        return (createdUser[1].message = "Error creating user");
      }
    }
  } catch (err) {
    return done(err);
  }
};

// passport passed as an argument from the app.js file means it will be used like this here
const googleStrategy = new GoogleStrategy(
  userGoogleCertificates,
  userGoogleProfile
);
passport.use(googleStrategy);

// Each subsequent request will not contain credentials,
// but rather the unique cookie that identifies the session.
// In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

module.exports = googleStrategy;
