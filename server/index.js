require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const register = require("@react-ssr/express/register");
const flash = require("express-flash");
const passport = require("passport");
const DB = require("../server/config/db");
const cors = require("cors");
const googleStrategy = require("./config/googleAuthStrategy")
const faceBookStrategy = require("./config/facebookAuthStrategy")


 // connect database
DB.connectDB()

const app = express();


// // get server port for production or 8080 for development
const SERVER_PORT = process.env.PORT || 8080 ;

//created a mongoDB collection to be used as session store. 
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

/**
 * @Desc
 * set headers on application
 * register enclosing the application 
 * is only needed for server side rendering of a react app
 */
register(app).then(() => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  /**
   * @Desc Register applicaition middlewares
   * bodyParser is used to parse the body of the request
   * morgan is used to log the request
   * session is used to store the session data
   * flash is used to store the flash messages
   * passport is used to authenticate the user
   * googleStrategy is used to authenticate the user
   */
  googleStrategy;
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(morgan("combined"));
  app.use(express.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );


  app.use(cors())

  /**
   * @Desc set global variable in express
   */
  app.use(function (req, res, next) {
    // set global user variable to the user currnetly in this cycle
    // this allows acccess of user within our template
    // create a new variable res.locals.user, save a user to it.
    // this is ised in the index.hbs, line 12, -> (the ../user)
    res.locals.user = req.user || null;
    next();
  });

  app.use(
    session({
      secret: "secret",
      store,
      resave: false,
      saveUninitialized: true,
    })
  );

  // error handlnig module
  app.use(flash());

  /**
   * @Desc set up routes
   */
  app.use("/api", require("./routes/api"));
  app.use("/", require("./controllers/home"));
  app.use("/", require("./controllers/user"));
  app.use("/", require("./controllers/project"));
  app.use("/", require("./controllers/password"));
  app.use("/", require("./controllers/facebookSSO"));
  app.use("/", require("./controllers/googleSSO"));

  /**
   * @Desc set up static files handling
   */
  app.use(express.static("public"));

  /**
   * @Desc listen to post when mongo connection is successful
   * @param {number} port - port number to listen to
   * @param {function} callback - callback function to be called when server is started
   * @returns {void}
   */
    app.listen(SERVER_PORT, () => {
      console.log("Edconnect server is live. listening on port " + SERVER_PORT);
      console.log("connecting to database...");
    });
});
