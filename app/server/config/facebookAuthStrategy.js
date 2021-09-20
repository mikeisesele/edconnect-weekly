require("dotenv").config();
const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const User = require("../services/user");

const FacebookCertificates = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ["id", "first_name", "last_name", "email", "picture"],
};

const userFacebookProfile = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {

  try {
    // checks if user with provider (= facebook) id exist in the db
    const checkUser = await User.getBySocialId(profile.provider, profile.id);
    // if user already exist return object
    if (checkUser) {
      done(null, checkUser);
    }

    //if user does not yet exist register with data returned by provider's authenticator
    if (!checkUser) {
      const userDetail = {
        firstname: profile._json.first_name,
        lastname: profile._json.last_name,
        email: profile.emails[0].value,
        password: profile._json.id,
        facebookId: profile.id,
      };

      const createdUser = await User.create(userDetail);

      if(createdUser[0]) {
        done(null, createdUser[1]);
      } else {
        return createdUser[1].message = "Error creating user";
      }
    }
  } catch (err) {
    done(err);
  }
};

// passport passed as an argument from the app.js file means it will be used like this here
const facebookStrategy = new FacebookStrategy(
  FacebookCertificates,
  userFacebookProfile
);
passport.use(facebookStrategy);

// Each subsequent request will not contain credentials,
// but rather the unique cookie that identifies the session.
// In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});

module.exports = facebookStrategy;
