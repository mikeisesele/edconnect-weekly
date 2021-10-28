require("dotenv").config();
const FacebookStrategy = require("passport-facebook").Strategy;
const { serializeUser, deserializeUser } = require("../../utils/serializer");
const passport = require("passport");

/**
 * @Desc Facebook authentication strategy. contains facebook credentials
 * @param {String} FacebookCertificates.profileFields - the facebook client profile fields
 */
const FacebookCertificates = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ["id", "first_name", "last_name", "email", "picture"],
};

/**
 * @Desc Facebook authentication strategy
 * @param {Object} userFacebookProfile - the facebook object 
 * @Param {String} profile - the facebook profile
 * @Param {Function} done - the callback function
 */
const userFacebookProfile = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {

  try {
    userFacebookProfile
    // checks if user with provider (= facebook) id exist in the db
    const checkUser = await User.getBySocialId(profile.provider, profile.id);
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
        provider: profile.provider,
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

serializeUser
deserializeUser

module.exports = facebookStrategy;
