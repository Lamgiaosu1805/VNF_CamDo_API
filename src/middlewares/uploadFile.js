const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const { FailureResponse } = require('../utils/ResponseRequest');
const YeuCauVayVonModel = require('../models/YeuCauVayVonModel');

//=================================================================================
const baseOriginalFolder = process.env.TYPE_DEPLOY == "PRODUCTION" ? '/var/www/X_finance_upload/file_goc' : path.join(require('os').homedir(), 'Desktop/X_finance_upload/file_goc');
const baseCompressedFolder = process.env.TYPE_DEPLOY == "PRODUCTION" ? '/var/www/X_finance_upload/file_nen' : path.join(require('os').homedir(), 'Desktop/X_finance_upload/file_nen');

//=================================================================================

const relativeBaseOriginal = 'X_finance_upload/file_goc';
const relativeBaseCompressed = 'X_finance_upload/file_nen';

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(baseOriginalFolder)) fs.mkdirSync(baseOriginalFolder, { recursive: true });
if (!fs.existsSync(baseCompressedFolder)) fs.mkdirSync(baseCompressedFolder, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const username = req.user.username || 'unknown';
        const userFolderOriginal = path.join(baseOriginalFolder, username);
        const userFolderCompressed = path.join(baseCompressedFolder, username);
        
        if (!fs.existsSync(userFolderOriginal)) fs.mkdirSync(userFolderOriginal, { recursive: true });
        if (!fs.existsSync(userFolderCompressed)) fs.mkdirSync(userFolderCompressed, { recursive: true });
        
        req.uploadPaths = { original: userFolderOriginal, compressed: userFolderCompressed };
        cb(null, userFolderOriginal); // Lưu ảnh gốc vào thư mục theo username
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ 
    storage, 
    // limits: { fileSize: 10 * 1024 * 1024 } // Tăng giới hạn kích thước file lên 10MB
}).array('images', 6); // Cho phép upload tối đa 6 file

const processImages = async (req, res, next) => {
    if (!req.files || !req.uploadPaths) return next();
    
    try {
        req.filePaths = req.files.map(file => {
            return { 
                original: path.join(relativeBaseOriginal.replace('X_finance_upload', ""), req.user.username || 'unknown', file.filename),
                compressed: path.join(relativeBaseCompressed.replace('X_finance_upload', ""), req.user.username || 'unknown', file.filename)
            };
        });

        await Promise.all(req.files.map(async (file) => {
            const compressedPath = path.join(req.uploadPaths.compressed, file.filename);
            await sharp(file.path)
                .resize({ width: 800 }) // Điều chỉnh kích thước nếu cần
                .jpeg({ quality: 70 }) // Giảm chất lượng xuống 70%
                .toFile(compressedPath);
        }));
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Error processing images', error: error.message });
    }
};

const uploadHandler = async (req, res, next) => {
    // const yeuCau = await YeuCauVayVonModel.findOne({customerId: req.user.id, status: 1})
    // if(yeuCau) {
    //     return res.json(FailureResponse("27"))
    // }
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.log(err.message)
            return res.json(FailureResponse("24", err.message));
        } else if (err) {
            return res.status(500).json({ message: 'Unknown error', error: err.message });
        }
        next();
    });
};

const uploadResponse = (req, res) => {
    if (!req.filePaths) {
        return res.status(400).json({ message: 'No files uploaded' });
    }
    res.status(200).json({ files: req.filePaths });
};

module.exports = { uploadHandler, processImages, uploadResponse };