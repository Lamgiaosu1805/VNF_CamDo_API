const express = require('express');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const TransactionController = require('../controllers/TransactionController');
const router = express.Router()

//admin
router.get('/DSYCRutTien', auth.verifyTokenAdmin, TransactionController.layDSYeuCauRT);
router.post('/pheDuyetYCRutTien', auth.verifyTokenAdmin, TransactionController.pheDuyetYeuCauRT);
router.post('/tuChoiYCRutTien', auth.verifyTokenAdmin, TransactionController.tuChoiYeuCauRT);

//customer
router.get('/getListBank', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, TransactionController.getListBank);
router.get('/DSTKLienKet', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, TransactionController.dsTKLK);
router.post('/addTKLienKet', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, TransactionController.addTKLienKet);
router.post('/napTien', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, TransactionController.napTien);
router.post('/rutTien', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, TransactionController.rutTien);

module.exports = router;