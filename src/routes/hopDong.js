const express = require('express');
const TaiSanTheChapController = require('../controllers/TaiSanTheChapController');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const HopDongController = require('../controllers/HopDongController');
const router = express.Router()

//admin
// router.post('/createLoaiTaiSan', auth.verifyTokenAdmin, TaiSanTheChapController.createLoaiTaiSan);
// router.get('/listTSTheChapAdmin', auth.verifyTokenAdmin, TaiSanTheChapController.showLoaiTaiSan);


//customer
router.post('/kyHopDong', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, HopDongController.kyHopDong);

module.exports = router;