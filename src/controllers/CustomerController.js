const CustomerHistoryLocationModel = require("../models/CustomerHistoryLocationModel")
const CustomerModel = require("../models/CustomerModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")

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
            res.json(FailureResponse("", error))
        }
    }
}
module.exports = CustomerController