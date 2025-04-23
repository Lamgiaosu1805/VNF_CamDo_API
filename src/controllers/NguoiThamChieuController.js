const MQHNguoiThamChieu = require("../models/MQHNguoiThamChieu")
const { SuccessResponse, FailureResponse } = require("../utils/ResponseRequest")

const NguoiThamChieuController = {
    themMQHNguoiThamChieu: async (req, res) => {
        try {
            const {tenMQH} = req.body
            const newData = new MQHNguoiThamChieu({
                tenMQH: tenMQH
            })
            await newData.save()
            res.json(SuccessResponse({
                message: "Đã thêm quan hệ người tham chiếu"
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("66", error))
        }
    },
    showDanhSachNguoiThamChieu: async (req, res) => {
        try {
            const listData = await MQHNguoiThamChieu.find({isDelete: false})
            res.json(SuccessResponse({
                message: "Lấy danh sách người tham chiếu thành công",
                data: listData
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("67", error))
        }
    },
    xoaMQHNguoiThamChieu: async (req, res) => {
        try {
            const {idMQH} = req.body
            const mqh = await MQHNguoiThamChieu.findByIdAndUpdate(idMQH, {isDelete: true})
            if(!mqh) {
                const error = "Mối quan hệ không tồn tại"
                return res.json(FailureResponse("68", error))
            }
            res.json(SuccessResponse({
                message: "Xoá mối quan hệ người tham chiếu thành công",
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("68", error))
        }
    }
}

module.exports = NguoiThamChieuController