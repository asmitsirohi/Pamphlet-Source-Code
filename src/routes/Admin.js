const express = require('express');
const AdminController = require('../controllers/AdminController');
const {ensureAuth, ensureAdmin, ensureCoAdmin} = require('../middlewares/auth');

const router = express.Router();
const AdminControllerObj = new AdminController();

router.get('/', ensureAuth, ensureCoAdmin, AdminControllerObj.dashboard);
router.get('/assignRole', ensureAuth, ensureAdmin, AdminControllerObj.assignRolePage);
router.post('/assignRole', ensureAuth, ensureAdmin, AdminControllerObj.assignRole);
router.get('/addTemplate', ensureAuth, ensureCoAdmin, AdminControllerObj.addTemplatePage);
router.post('/addTemplate', ensureAuth, ensureCoAdmin, AdminControllerObj.addTemplate);

module.exports = router;
