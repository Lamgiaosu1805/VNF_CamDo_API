const express = require('express');
const auth = require('../middlewares/auth');
const validateDevice = require('../middlewares/validateDeviceId');
const YeuCauVayVonController = require('../controllers/YeuCauVayVonController');
const { processImages, uploadHandler } = require('../middlewares/uploadFile');
const router = express.Router()

//admin

//customer
router.post('/guiYeuCau', uploadHandler, processImages, YeuCauVayVonController.guiYeuCauVayVon);

module.exports = router;