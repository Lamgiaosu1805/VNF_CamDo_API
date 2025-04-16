const express = require('express');
const auth = require('../middlewares/auth');
const NotificationController = require('../controllers/NotificationController');
const validateDevice = require('../middlewares/validateDeviceId');
const router = express.Router()

//admin
router.post('/sendNofification', auth.verifyTokenAdmin, NotificationController.testFirebasePush);
router.post('/saveFirebaseToken', auth.verifyTokenAdmin, NotificationController.saveFirebaseTokenAdmin);
router.get('/getNotificationAdmin', auth.verifyTokenAdmin, NotificationController.getNotification);
router.get('/seenNotiAdmin/:idNoti', auth.verifyTokenAdmin, NotificationController.seenNoti);
router.get('/seenAllNotiAdmin', auth.verifyTokenAdmin, NotificationController.seenAllNoti);

//customer
router.get('/getNotificationCustomer', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, NotificationController.getNotification);
router.get('/seenNoti/:idNoti', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, NotificationController.seenNoti);
router.get('/seenAllNoti', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, NotificationController.seenAllNoti);

module.exports = router;