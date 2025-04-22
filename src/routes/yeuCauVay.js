const express = require('express');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const YeuCauVayVonController = require('../controllers/YeuCauVayVonController');
const { processImages, uploadHandler } = require('../middlewares/uploadFile');
const router = express.Router()

//admin
router.post('/guiYeuCauGiaiNgan', auth.verifyTokenAdmin, YeuCauVayVonController.guiYeuCauGiaiNgan);
router.post('/thamDinh', auth.verifyTokenAdmin, YeuCauVayVonController.thamDinh);
router.post('/tinhSoTien', auth.verifyTokenAdmin, YeuCauVayVonController.tinhTien);
router.post('/dongYGiaiNgan', auth.verifyTokenAdmin, YeuCauVayVonController.dongYGiaiNgan);
router.get('/getDanhSachYCAdmin', auth.verifyTokenAdmin, YeuCauVayVonController.getYCGoiVonAdmin);



//customer
router.post('/guiYeuCau', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, uploadHandler, processImages, YeuCauVayVonController.guiYeuCauVayVon);
router.get('/getDanhSach', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, YeuCauVayVonController.getDanhSachYeuCauVayVon);
router.post('/huyYeuCau', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, YeuCauVayVonController.huyYeuCau);
router.post('/tinhSoTienCustomer', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, YeuCauVayVonController.tinhTien);

module.exports = router;