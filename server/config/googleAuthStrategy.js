require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../services/user");
const { serializeUser, deserializeUser } = require("../../utils/serializer");


/**
 * @Desc Google authentication strategy
 * @param {Object} userGoogleCertificates - the  options for the strategy
 */
const userGoogleCertificates = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

const userGoogleProfile = async (accessToken, refreshToken, profile, done) => {
  try {
    //checks if user with provider (= google) id exist in the db and return user if true
    const checkUser = await User.getBySocialId(profile.provider, profile.id);
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

serializeUser;
deserializeUser;

module.exports = googleStrategy;
