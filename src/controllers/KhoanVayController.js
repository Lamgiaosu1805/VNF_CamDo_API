const KhoanVayModel = require("../models/KhoanVayModel")
const KyVayModel = require("../models/KyVayModel")
const { SuccessResponse, FailureResponse } = require("../utils/ResponseRequest")

const KhoanVayController = {
    layDanhSachKhoanVayCustomer: async (req, res) => {
        try {
            const listData = await KhoanVayModel.find({customerId: req.user.id})
            res.json(SuccessResponse({
                message: "Lấy danh sách khoản vay thành công",
                data: listData
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("45", error))
        }
    },
    layDanhSachKhoanVayAdmin: async (req, res) => {
        try {
            const listData = await KhoanVayModel.find()
            res.json(SuccessResponse({
                message: "Lấy danh sách khoản vay thành công",
                data: listData
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("45", error))
        }
    },
    layChiTietKhoanVay: async (req, res) => {
        try {
            const {idKhoanVay} = req.params
            const khoanVay = await KhoanVayModel.findById(idKhoanVay)
            const kyTraNo = await KyVayModel.find({soHopDong: khoanVay.soHopDong})
            res.json(SuccessResponse({
                message: "Lấy danh sách khoản vay thành công",
                dataKhoanVay: khoanVay,
                kyTraNo
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("61", error))
        }
    }
}
module.exports = KhoanVayController