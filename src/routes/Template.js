const express = require("express");
const TemplateController = require("../controllers/TemplateController");
const { ensureGuest, ensureAuth } = require("../middlewares/auth");

const router = express.Router();
const TemplateControllerObj = new TemplateController();

router.get("/:username/:foldername", TemplateControllerObj.portfolio);
router.post("/contactUs", TemplateControllerObj.contactUs);


module.exports = router;
