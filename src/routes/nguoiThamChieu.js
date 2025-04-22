const express = require('express');
const TaiSanTheChapController = require('../controllers/TaiSanTheChapController');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const NguoiThamChieuController = require('../controllers/NguoiThamChieuController');
const router = express.Router()

//admin
router.post('/addMQH', auth.verifyTokenAdmin, NguoiThamChieuController.themMQHNguoiThamChieu);
router.get('/getDanhSachMQHAdmin', auth.verifyTokenAdmin, NguoiThamChieuController.showDanhSachNguoiThamChieu);

//customer
router.get('/getDanhSachMQH', auth.verifyTokenCustomerNonEkyc, validateDevice.checkSameDeviceId, NguoiThamChieuController.showDanhSachNguoiThamChieu);

module.exports = router;