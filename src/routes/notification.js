const express = require('express');
const auth = require('../middlewares/auth');
const NotificationController = require('../controllers/NotificationController');
const validateDevice = require('../middlewares/validateDeviceId');
const router = express.Router()

//admin
router.post('/sendNofification', auth.verifyTokenAdmin, NotificationController.testFirebasePush);
router.post('/saveFirebaseToken', auth.verifyTokenAdmin, NotificationController.saveFirebaseTokenAdmin);
router.get('/getNotificationAdmin', auth.verifyTokenAdmin, NotificationController.getNotification);

//customer
router.get('/getNotificationCustomer', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, NotificationController.getNotification);

module.exports = router;