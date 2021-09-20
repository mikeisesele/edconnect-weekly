require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const register = require("@react-ssr/express/register");
const flash = require("express-flash");
const passport = require("passport");
const DB = require("../server/config/db");
const googleStrategy = require("./config/googleAuthStrategy")
const facebookStrategy = require("./config/facebookAuthStrategy")



DB.connectDB();
const app = express();

// get server port from .env file, we will use this port to run our server
const SERVER_PORT = process.env.SERVER_PORT;

//created a mongoDB collection to be used as session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

// set headers on application
// register is only needed for server side rencering of a react app
register(app).then(() => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  googleStrategy;
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(morgan("combined"));
  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );

  // app.use(fileupload({ useTempFiles: true }));


  // set global variable in express
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

  // set up routes
  app.use("/api", require("./routes/api"));
  app.use("/", require("./controllers/home"));
  app.use("/", require("./controllers/user"));
  app.use("/", require("./controllers/project"));
  app.use("/", require("./controllers/facebookAuth"));
  app.use("/", require("./controllers/googleAuth"));

  // set up static files
  app.use(express.static("public"));

  // listen to post when mongo connection is successful
  app.listen(SERVER_PORT, () => {
    console.log("Server listening on port " + SERVER_PORT);
    console.log("connecting to database...");
    });
});
