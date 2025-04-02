const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { FailureResponse } = require('../utils/ResponseRequest');

// Đường dẫn thư mục lưu ảnh
//Dev
// const uploadDir = path.join(os.homedir(), 'Desktop', 'X_finance_private');

//Production
const uploadDir = '/var/www/X_finance_private';

// Tạo thư mục nếu chưa có
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình `multer`
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${file.fieldname}${ext}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ hỗ trợ file JPG, PNG, HEIC!'));
        }
    }
}).fields([
    { name: 'portrait', maxCount: 1 },
    { name: 'front_id', maxCount: 1 },
    { name: 'back_id', maxCount: 1 }
]);

// Middleware xử lý upload và lấy đường dẫn tương đối
const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.json(FailureResponse("29", err.message));
        }

        if (!req.files || !req.files.portrait || !req.files.front_id || !req.files.back_id) {
            return res.json(FailureResponse("29", 'Vui lòng upload đủ 3 ảnh: portrait, front_id, back_id!'));
        }

        // Lấy đường dẫn từ `X_finance_private`
        req.uploadedFiles = {
            portrait: req.files.portrait ? `X_finance_private/${req.files.portrait[0].filename}` : null,
            front_id: req.files.front_id ? `X_finance_private/${req.files.front_id[0].filename}` : null,
            back_id: req.files.back_id ? `X_finance_private/${req.files.back_id[0].filename}` : null
        }

        next(); // Chuyển tiếp đến controller
    });
};

module.exports = uploadMiddleware;
