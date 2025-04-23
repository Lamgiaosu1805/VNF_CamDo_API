const express = require('express');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const NguoiThamChieuController = require('../controllers/NguoiThamChieuController');
const router = express.Router()

//admin
router.post('/addMQH', auth.verifyTokenAdmin, NguoiThamChieuController.themMQHNguoiThamChieu);
router.get('/getDanhSachMQHAdmin', auth.verifyTokenAdmin, NguoiThamChieuController.showDanhSachNguoiThamChieu);
router.post('/xoaMQH', auth.verifyTokenAdmin, NguoiThamChieuController.xoaMQHNguoiThamChieu);

//customer
router.get('/getDanhSachMQH', auth.verifyTokenCustomerNonEkyc, validateDevice.checkSameDeviceId, NguoiThamChieuController.showDanhSachNguoiThamChieu);

module.exports = router;