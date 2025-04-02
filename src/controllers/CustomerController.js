const { default: mongoose } = require("mongoose")
const CustomerHistoryLocationModel = require("../models/CustomerHistoryLocationModel")
const CustomerModel = require("../models/CustomerModel")
const NotificationTokenModel = require("../models/NotificationTokenModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")
const { sendNotification, formatMoney, hideUsername } = require("../utils/Tools")
const fs = require('fs');

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
            // if(customer && (customer._id != req.user.id)) {
            //     deleteUploadedFiles(req.files); 
            //     return res.json(FailureResponse("29", "CCCD đã được sử dụng"))
            // }

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
            const customerInfo = await CustomerModel.findById(req.user.id).select("-password -firebaseToken")
            res.json(SuccessResponse({
                message: "Lấy thông tin thành công",
                data: customerInfo
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
            const listCustomer = await CustomerModel.find({isDelete: false}).select("-password")
            res.json(SuccessResponse({
                message: "Lấy danh sách thành công",
                data: listCustomer
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("44", error))
        }
    },
    napTien: async (req, res) => {
        try {
            const {image, soTienNap} = req.body
            if(!Number.isInteger(soTienNap)) {
                return res.json(FailureResponse("49", "Số tiền nạp không đúng định dạng"))
            }
            if(!image || !soTienNap) {
                res.json(FailureResponse("48"))
            }
            else {
                const customer = await CustomerModel.findById(req.user.id)
                const soDuMoi = customer.soDuKhaDung + soTienNap
                await customer.updateOne({soDuKhaDung: soDuMoi})
                try {
                    const notification = {
                        title: "X-FINANCE",
                        content: `Tài khoản ${hideUsername(customer.username)} đã nạp thành công số tiền ${formatMoney(soTienNap)} VNĐ\nSố dư khả dụng: ${formatMoney(soDuMoi)} VNĐ`
                    }
                    const notificationToken = await NotificationTokenModel.findOne({userId: req.user.id})
                    sendNotification([notificationToken.token], notification.title, notification.content)
                } catch (error) {
                    console.log(error)
                }
                res.json(SuccessResponse({
                    message: "Nạp tiền thành công",
                    soDuKhaDungMoi: soDuMoi
                }))
            }
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("49", error))
        }
    }
}
module.exports = CustomerController