const User = require("../models/UserModel");
const UserTemplate = require("../models/UserTemplateModel");
const Template = require("../models/TemplateModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sendmail = require("../middlewares/sendMail");
const fs = require("fs");
const path = require("path");
const passport = require("passport");

class UserControlller {
  loginPage = (req, res) => {
    let role = "user";
    let loggedinUser = req.user;
    if (loggedinUser != undefined) {
      role = loggedinUser.role;
      loggedinUser = loggedinUser.name;
    }
    const params = { title: "User Login", loggedinUser, role };
    res.status(201).render("login", params);
  };

  signupPage = (req, res) => {
    let role = "user";
    let loggedinUser = req.user;
    if (loggedinUser != undefined) {
      role = loggedinUser.role;
      loggedinUser = loggedinUser.name;
    }
    const params = { title: "User Signup", loggedinUser, role };
    res.status(201).render("signup", params);
  };

  signup = async (req, res) => {
    const { firstname, lastname, username, email, password } = req.body;
    const name = firstname + " " + lastname;

    try {
      const user = await User.findOne({ $or: [{ email }, { username }] });

      if (user != null) {
        return res.json({ status: "error", error: "already_exists" });
      }

      const OTP = Math.floor(100000 + Math.random() * 900000);

      const token = jwt.sign(
        {
          name,
          email,
          username,
          password,
          OTP,
        },
        process.env.JWT_SECRET
      );

      res.cookie("portfolioOTP", token, {
        expires: new Date(Date.now() + 300000), //5min
        httpOnly: true,
      });

      const subject = "OTP for Pamphlet account verification";
      const body = `<h2>Hi, ${name}</h2><p>Your OTP: ${OTP}</p> <p>Your OTP will expires in 5 minutes.</p><br><br> <small>Do not share your otp with others.</small>`;

      sendmail(email, subject, body, (err) => {
        if (err) {
          return res.status(500).json({ status: "error", error: "wrong" });
        }

        res.status(200).json({ status: "ok" });
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: "wrong" });
    }
  };

  login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        res.json({ status: "error", error: "wrong" });
      }
      if (!user) {
        res.json({ status: "error", error: "invalid" });
      }
      req.logIn(user, (err) => {
        res.json({ status: "ok" });
      });
    })(req, res, next);
  };

  logout = (req, res) => {
    req.logout();
    res.redirect("/");
  };

  otpPage = async (req, res) => {
    const token = req.cookies.portfolioOTP;

    let verifyTokenOTP = null;
    if (token != undefined) {
      try {
        verifyTokenOTP = await jwt.verify(token, process.env.JWT_SECRET);
        const params = { title: "OTP-User", verifyTokenOTP };
        res.status(200).render("otp", params);
      } catch (error) {
        const params = {
          title: "500 Error",
          errorMsg: `Server error: ${error.name}`,
        };
        res.status(500).render("error/500", params);
      }
    } else {
      res.redirect("/");
    }
  };

  otp = async (req, res) => {
    const { otp } = req.body;
    const token = req.cookies.portfolioOTP;

    if (token == undefined) {
      return res.json({ status: "error", error: "otp_expires" });
    }

    try {
      let verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
      const hashPassword = await bcrypt.hash(verifyToken.password, 10);

      if (otp == verifyToken.OTP) {
        const newUser = new User({
          name: verifyToken.name,
          email: verifyToken.email,
          username: verifyToken.username,
          password: hashPassword,
        });

        const savedUser = await newUser.save();

        res.clearCookie("portfolioOTP");

        res.json({ status: "ok" });
      } else {
        return res.json({ status: "error", error: "invalid_otp" });
      }
    } catch (error) {
      res.status(500).json({ status: "error", error: "wrong" });
    }
  };

  profile = async (req, res) => {
    let role = "user";
    let loggedinUser = req.user;
    let loggedinUsername;
    if (loggedinUser != undefined) {
      role = loggedinUser.role;
      loggedinUsername = loggedinUser.username;
      loggedinUser = loggedinUser.name;
    }

    try {
      let bulkTemplates = [];
      const usertemplates = await UserTemplate.find({
        user: req.user._id,
      }).lean();

      for (const element of usertemplates) {
        let templates = await Template.find({ _id: element.template }).lean();

        bulkTemplates.push(templates);
      }

      const params = {
        title: `Profile-${loggedinUser}`,
        loggedinUser,
        bulkTemplates,
        loggedinUsername,
        role,
      };
      res.status(200).render("profile", params);
    } catch (error) {
      const params = {
        title: "500 Error",
        errorMsg: `Server error: ${error.name}`,
      };
      res.status(500).render("error/500", params);
    }
  };

  deletePortfolio = async (req, res) => {
    const templateId = req.body.deletePortfolioId;

    try {
      const { profileImage } = await UserTemplate.findOne(
        { $and: [{ user: req.user._id }, { template: templateId }] },
        { _id: 0, profileImage: 1 }
      );

      const result = await UserTemplate.deleteOne({
        $and: [{ user: req.user._id }, { template: templateId }],
      });

      fs.unlink(
        path.join(__dirname, `../../public/media/usersImages/`, profileImage),
        (err) => {
          if (err) console.log(err);
        }
      );

      res.redirect("/user/profile");
    } catch (error) {
      console.log(error);
      const params = {
        title: "500 Error",
        errorMsg: `Server error: ${error.name}`,
      };
      res.status(500).render("error/500", params);
    }
  };
}

module.exports = UserControlller;
