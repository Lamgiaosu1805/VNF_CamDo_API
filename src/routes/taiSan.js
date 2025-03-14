const express = require('express');
const TaiSanTheChapController = require('../controllers/TaiSanTheChapController');
const auth = require('../middlewares/auth');
const router = express.Router()

router.post('/createLoaiTaiSan', auth.verifyTokenAdmin, TaiSanTheChapController.createLoaiTaiSan);


module.exports = router;