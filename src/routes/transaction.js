const express = require('express');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const TransactionController = require('../controllers/TransactionController');
const router = express.Router()

//admin

//customer
router.get('/getListBank', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, TransactionController.getListBank);
router.post('/addTKLienKet', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, TransactionController.addTKLienKet);
router.post('/napTien', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, TransactionController.napTien);

module.exports = router;