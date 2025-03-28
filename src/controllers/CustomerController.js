const CustomerHistoryLocationModel = require("../models/CustomerHistoryLocationModel")
const CustomerModel = require("../models/CustomerModel")
const NotificationTokenModel = require("../models/NotificationTokenModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")
const { sendNotification, formatMoney, hideUsername } = require("../utils/Tools")

const CustomerController = {
    ekyc: async(req, res, next) => {
        try {
            await CustomerModel.findByIdAndUpdate(req.user.id, {isEkyc: true})
            res.json(SuccessResponse({
                message: "EKYC thành công"
            }))
        } catch (error) {
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