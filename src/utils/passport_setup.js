const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");

const googleStrategy = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          name: profile.displayName,
          username: profile.name.givenName+profile.name.familyName,
          googleId: profile.id,
        };

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (error) {
          // const params = {
          //   title: "500 Error",
          //   errorMsg: `Server error: ${error.name}`,
          // };
          // res.status(500).render("500", params);
          console.log(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

const localStrategy = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          let user = await User.findOne({ email: email });

          if (user) {
            if (!(await bcrypt.compare(password, user.password))) {
              return done(null, false, {
                message: "Incorrect login credentials.",
              });
            }

            done(null, user);
          } else {
            return done(null, false, {
              message: "Incorrect login credentials.",
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
};

module.exports = { googleStrategy, localStrategy };
