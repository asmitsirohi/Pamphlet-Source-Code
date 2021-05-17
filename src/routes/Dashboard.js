const express = require("express");
const DashboardController = require("../controllers/DashboardController");
const { ensureGuest, ensureAuth } = require("../middlewares/auth");

const router = express.Router();
const DashboardControllerObj = new DashboardController();

router.get("/", DashboardControllerObj.index);
router.get("/templates", DashboardControllerObj.templates);
router.get("/demo/:id", DashboardControllerObj.viewTemplates);
router.get("/useTemplate/:id", ensureAuth, DashboardControllerObj.useTemplatePage);
router.post("/useTemplate", DashboardControllerObj.useTemplate);

module.exports = router;
