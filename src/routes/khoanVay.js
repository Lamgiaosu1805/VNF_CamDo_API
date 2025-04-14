const express = require('express');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const KhoanVayController = require('../controllers/KhoanVayController');
const router = express.Router()

//admin
router.get('/danhSachKhoanVayAdmin', auth.verifyTokenAdmin, KhoanVayController.layDanhSachKhoanVayAdmin);
router.get('/chiTietKhoanVayAdmin/:idKhoanVay', auth.verifyTokenAdmin, KhoanVayController.layChiTietKhoanVay);

//customer
router.get('/danhSachKhoanVay', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, KhoanVayController.layDanhSachKhoanVayCustomer);
router.get('/chiTietKhoanVay/:idKhoanVay', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, KhoanVayController.layChiTietKhoanVay);
router.post('/thanhToanNo', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, KhoanVayController.thanhToanNo);

module.exports = router;