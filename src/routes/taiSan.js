const express = require('express');
const TaiSanTheChapController = require('../controllers/TaiSanTheChapController');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const router = express.Router()

//admin
router.post('/createLoaiTaiSan', auth.verifyTokenAdmin, TaiSanTheChapController.createLoaiTaiSan);
router.get('/listTSTheChapAdmin', auth.verifyTokenAdmin, TaiSanTheChapController.showLoaiTaiSan);
router.post('/updateLoaiTS', auth.verifyTokenAdmin, TaiSanTheChapController.chinhSuaLoaiTS);


//customer
router.get('/listTSTheChap', auth.verifyTokenCustomerNonEkyc, validateDevice.checkSameDeviceId, TaiSanTheChapController.showLoaiTaiSan);

module.exports = router;