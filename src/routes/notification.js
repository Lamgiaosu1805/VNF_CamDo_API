const express = require('express');
const auth = require('../middlewares/auth');
const NotificationController = require('../controllers/NotificationController');
const router = express.Router()

//admin
router.post('/sendNofification', auth.verifyTokenAdmin, NotificationController.testFirebasePush);

//customer

module.exports = router;