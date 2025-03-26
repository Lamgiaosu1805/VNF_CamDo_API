const express = require('express');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const KhoanVayController = require('../controllers/KhoanVayController');
const router = express.Router()

//admin
router.get('/danhSachKhoanVayAdmin', auth.verifyTokenAdmin, KhoanVayController.layDanhSachKhoanVayAdmin);

//customer
router.get('/danhSachKhoanVay', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, KhoanVayController.layDanhSachKhoanVayCustomer);

module.exports = router;