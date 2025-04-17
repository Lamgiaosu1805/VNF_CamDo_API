const LoaiTaiSanTheChapModel = require("../models/LoaiTaiSanTheChapModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")

const TaiSanTheChapController = {
    createLoaiTaiSan: async (req, res) => {
        try {
            const {body} = req
            const number = await LoaiTaiSanTheChapModel.countDocuments()
            const newData = new LoaiTaiSanTheChapModel({
                ten: body.tenLoaiTaiSan,
                imageUrl: body.imageUrl,
                type: number + 1
            })
            await newData.save()
            res.json(SuccessResponse({
                message: "Thêm mới loại tài sản thành công"
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("19", error))
        }
    },
    showLoaiTaiSan: async (req, res) => {
        try {
            const listLoaiTaiSan = await LoaiTaiSanTheChapModel.find()
            res.json(SuccessResponse({
                message: "Lấy danh sách thành công",
                data: listLoaiTaiSan
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("23", error))
        }
    }
}

module.exports = TaiSanTheChapController