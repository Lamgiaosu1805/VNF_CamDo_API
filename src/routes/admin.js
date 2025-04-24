const express = require('express');
const auth = require('../middlewares/auth');
const AdminController = require('../controllers/AdminController');
const router = express.Router()

//admin
router.get('/info', auth.verifyTokenAdmin, AdminController.getAccountInfo);

module.exports = router;