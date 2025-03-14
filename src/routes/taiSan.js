const express = require('express');
const TaiSanTheChapController = require('../controllers/TaiSanTheChapController');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const router = express.Router()

//admin
router.post('/createLoaiTaiSan', auth.verifyTokenAdmin, TaiSanTheChapController.createLoaiTaiSan);
router.get('/listTSTheChapAdmin', auth.verifyTokenAdmin, TaiSanTheChapController.showLoaiTaiSan);


//customer
router.get('/listTSTheChap', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, TaiSanTheChapController.showLoaiTaiSan);

module.exports = router;