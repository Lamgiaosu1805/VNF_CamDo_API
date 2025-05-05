const { default: mongoose } = require("mongoose")
const CustomerHistoryLocationModel = require("../models/CustomerHistoryLocationModel")
const CustomerModel = require("../models/CustomerModel")
const NotificationTokenModel = require("../models/NotificationTokenModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")
const fs = require('fs');
const NotificationUserModel = require("../models/NotificationUserModel")

const deleteUploadedFiles = (files) => {
    if (!files) return;
    Object.values(files).forEach((fileArray) => {
        fileArray.forEach((file) => {
            const filePath = file.path; // Đảm bảo lấy đường dẫn đúng từ file object
            if (fs.existsSync(filePath)) {
                console.log(`Đang xóa file: ${filePath}`);
                fs.unlinkSync(filePath); // Xóa file
                console.log(`Đã xóa file: ${filePath}`);
            } else {
                console.log(`Không tìm thấy file: ${filePath}`);
            }
        });
    });
};

const CustomerController = {
    ekyc: async(req, res, next) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
        
            const {base64String} = req.body
            const decodedString = Buffer.from(base64String, 'base64').toString('utf-8')
            const jsonData = JSON.parse(decodedString)
            const fullname = jsonData.object.name
            const birth = jsonData.object.birth_day
            const cccd = jsonData.object.id
            const diaChiThuongTru = jsonData.object.recent_location.replaceAll(/\n/g, ", ")
            const gioiTinh = jsonData.object.gender
            const ngayCapCCCD = jsonData.object.issue_date
            const noiCapCCCD = jsonData.object.issue_place.replaceAll(/\n/g, ", ")
            const ngayHetHanCCCD = jsonData.object.valid_date
            const customer = await CustomerModel.findOne({cccd: cccd})
            if(customer && (customer._id != req.user.id)) {
                deleteUploadedFiles(req.files); 
                return res.json(FailureResponse("29", "CCCD đã được sử dụng"))
            }

            await CustomerModel.findByIdAndUpdate(
                req.user.id, 
                {
                    isEkyc: true, 
                    fullname, 
                    birth, 
                    cccd, 
                    diaChiThuongTru, 
                    gioiTinh, 
                    ngayCapCCCD, 
                    noiCapCCCD, 
                    ngayHetHanCCCD,
                    cccdFrontImg: req.uploadedFiles.front_id,
                    cccdBackImg: req.uploadedFiles.back_id,
                    anhChanDung: req.uploadedFiles.portrait
                }
            )
            await session.commitTransaction();
            session.endSession();
            res.json(SuccessResponse({
                message: "EKYC thành công",
                data: {
                    fullname, 
                    birth, 
                    cccd, 
                    diaChiThuongTru, 
                    gioiTinh, 
                    ngayCapCCCD, 
                    noiCapCCCD, 
                    ngayHetHanCCCD,
                    cccdFrontImg: req.uploadedFiles.front_id,
                    cccdBackImg: req.uploadedFiles.back_id,
                    anhChanDung: req.uploadedFiles.portrait
                }
            }))
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            deleteUploadedFiles(req.files);
            console.log(error)
            res.json(FailureResponse("29", error))
        }
    },
    getCustomerInfo: async (req, res) => {
        try {
            const customerInfo = req.customer
            const { password, firebaseToken, anhChanDung, cccdBackImg, cccdFrontImg, deviceId, ...cleanedUser} = customerInfo._doc;
            const soTBChuaDoc = await NotificationUserModel.countDocuments({userId: customerInfo._id, isSeen: false})
            res.json(SuccessResponse({
                message: "Lấy thông tin thành công",
                soTBChuaDoc: soTBChuaDoc,
                data: cleanedUser
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("38", error))
        }
    },
    pushLocation: async (req, res) => {
        try {
            const { latitude, longitude, actionPush, username } = req.body
            const newLocation = new CustomerHistoryLocationModel({
                latitude: latitude,
                longitude: longitude,
                username: username,
                actionPush: actionPush
            })
            await newLocation.save()
            res.json(SuccessResponse({
                message: "Gửi vị trí thành công"
            }))
        } catch (error) {
            res.json(FailureResponse("40", error))
            console.log(error)
        }
    },
    layDanhSachKhachHang: async (req, res) => {
        try {
            const listCustomer = await CustomerModel.find({isDelete: false}).sort({ createdAt: -1 }).select("-password")
            res.json(SuccessResponse({
                message: "Lấy danh sách thành công",
                total: listCustomer.length,
                data: listCustomer
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("44", error))
        }
    },
    getCustomerInfoAdmin: async (req, res) => {
        try {
            const {customerId} = req.params
            const customer = await CustomerModel.findById(customerId).select('-password')
            const basePath = "/var/www/X_finance_private/"
            const pathPortraitImg = path.resolve('/var/www/X_finance_private/X_finance_private/1743644074881-portrait.png');
            const pathFrontCCCDImg = basePath + customer.cccdFrontImg
            const pathBackCCCDImg = basePath + customer.cccdBackImg
            const imageBuffer = fs.readFileSync(pathPortraitImg)
            const base64Image = imageBuffer.toString('base64');
            res.json(base64Image)
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("38", error))
        }
    }
}
module.exports = CustomerController