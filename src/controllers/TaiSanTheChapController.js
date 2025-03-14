const LoaiTaiSanTheChapModel = require("../models/LoaiTaiSanTheChapModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")

const TaiSanTheChapController = {
    createLoaiTaiSan: async (req, res) => {
        try {
            const {body} = req
            const newData = new LoaiTaiSanTheChapModel({
                ten: body.tenLoaiTaiSan
            })
            await newData.save()
            res.json(SuccessResponse({
                message: "Thêm mới loại tài sản thành công"
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("19", error))
        }
    }
}

module.exports = TaiSanTheChapController