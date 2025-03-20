const express = require('express');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const YeuCauVayVonController = require('../controllers/YeuCauVayVonController');
const { processImages, uploadHandler } = require('../middlewares/uploadFile');
const router = express.Router()

//admin
router.post('/guiYeuCauGiaiNgan', auth.verifyTokenAdmin, YeuCauVayVonController.guiYeuCauGiaiNgan);


//customer
router.post('/guiYeuCau', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, uploadHandler, processImages, YeuCauVayVonController.guiYeuCauVayVon);
router.get('/getDanhSach', auth.verifyTokenCustomer, validateDevice.checkSameDeviceId, YeuCauVayVonController.getDanhSachYeuCauVayVon);

module.exports = router;