require("dotenv").config();
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
require("./src/db/conn");

const app = express();

// Passport config
const { googleStrategy, localStrategy } = require("./src/utils/passport_setup");
googleStrategy(passport);
localStrategy(passport);

// Static folder
const static_path = path.join(__dirname, "public");
app.use(express.static(static_path));

app.use(express.json());
app.use(cookieParser());

// Body Parser
app.use(express.urlencoded({ extended: false }));

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Handlebars helpers
const { splitSkills, stripTags, ifNotCond, ifCond, indexIncrement } = require("./src/helpers/hbs");

// Handlebars
app.set("views", path.join(__dirname, "./src/views"));
// app.set("layout", path.join(__dirname, "./src/views/layouts", "layout"));
app.engine(
  ".hbs",
  exphbs({
    helpers: { splitSkills, stripTags, ifNotCond, ifCond, indexIncrement },
    defaultLayout: "layout",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// set global variable
// app.use(function (req, res, next) {
//   res.locals.user = req.user || null;
//   next();
// });

// Routes

const DashboardRouter = require("./src/routes/Dashboard");
app.use("/", DashboardRouter);

const UserRouter = require("./src/routes/User");
app.use("/user", UserRouter);

const AdminRouter = require("./src/routes/Admin");
app.use("/admin", AdminRouter);

const authRouter = require("./src/routes/Auth");
app.use("/auth", authRouter);

app.use(
  "/templateDependencies",
  express.static(path.join(__dirname, "templates/templateDependencies"))
);

const templateRouter = require("./src/routes/Template");
app.use("/", templateRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening on PORT ${PORT}`));
