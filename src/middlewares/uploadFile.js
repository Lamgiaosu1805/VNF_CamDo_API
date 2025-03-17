const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

const originalFolder = path.join(require('os').homedir(), 'Desktop/X_finance_upload/file_goc');
const compressedFolder = path.join(require('os').homedir(), 'Desktop/X_finance_upload/file_nen');

// Tạo thư mục nếu chưa tồn tại
// if (!fs.existsSync(originalFolder)) fs.mkdirSync(originalFolder, { recursive: true });
// if (!fs.existsSync(compressedFolder)) fs.mkdirSync(compressedFolder, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, originalFolder); // Lưu ảnh gốc vào file_goc
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 } // Giới hạn kích thước file 5MB
}).array('images', 2); // Cho phép upload tối đa 2 file

const processImages = async (req, res, next) => {
    if (!req.files) return next();
    
    await Promise.all(req.files.map(async (file) => {
        const compressedPath = path.join(compressedFolder, file.filename);
        await sharp(file.path)
            // .resize({ width: 800 }) // Điều chỉnh kích thước nếu cần
            .jpeg({ quality: 70 }) // Giảm chất lượng xuống 70%
            .toFile(compressedPath);
    }));

    next();
};

const uploadHandler = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: 'Multer error', error: err.message });
        } else if (err) {
            return res.status(500).json({ message: 'Unknown error', error: err.message });
        }
        next();
    });
};

module.exports = { uploadHandler, processImages };