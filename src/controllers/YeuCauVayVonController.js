const YeuCauVayVonModel = require("../models/YeuCauVayVonModel");
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest");

const YeuCauVayVonController = {
    guiYeuCauVayVon: async (req, res) => {
        try {
            const {nhanHieu, tenTaiSan, idLoaiTaiSan, namSX} = req.body
            if (!req.filePaths) {
                return res.json(FailureResponse("25"));
            }
            const newData = new YeuCauVayVonModel({
                idLoaiTaiSan: idLoaiTaiSan,
                nhanHieu: nhanHieu,
                tenTaiSan: tenTaiSan,
                listAnhTaiSan: req.filePaths,
                customerId: req.user.id,
                namSX: namSX
            })
            await newData.save()
            res.json(SuccessResponse({
                message: "Tạo yêu cầu vay vốn thành công"
            }));
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("26", error))
        }
    },
    getDanhSachYeuCauVayVon: async (req, res, next) => {
        try {
            const listData = await YeuCauVayVonModel.find()
            res.json(SuccessResponse({
                message: "Lấy danh sách yêu cầu thành công",
                data: listData
            }))
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = YeuCauVayVonController