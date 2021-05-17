const express = require("express");
const UserController = require("../controllers/UserController");
const { ensureGuest, ensureAuth } = require("../middlewares/auth");
const googleRecaptcha = require("../utils/googleRecaptcha");
const UserControlller = require("../controllers/UserController");

const router = express.Router();
const UserControllerObj = new UserController();

router.get("/login", ensureGuest, UserControllerObj.loginPage);
router.get("/signup", ensureGuest, UserControllerObj.signupPage);
router.post("/signup", googleRecaptcha, UserControllerObj.signup);
router.get("/logout", ensureAuth, UserControllerObj.logout);

router.post("/login", googleRecaptcha, UserControllerObj.login);

router.get("/otp", UserControllerObj.otpPage);
router.post("/otp", googleRecaptcha, UserControllerObj.otp);

router.get("/profile", ensureAuth, UserControllerObj.profile);
router.delete(
  "/deletePortfolio",
  ensureAuth,
  UserControllerObj.deletePortfolio
);

module.exports = router;
