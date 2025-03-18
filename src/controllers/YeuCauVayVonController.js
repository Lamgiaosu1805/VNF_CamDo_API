const YeuCauVayVonModel = require("../models/YeuCauVayVonModel");
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest");

const YeuCauVayVonController = {
    guiYeuCauVayVon: async (req, res) => {
        try {
            const {nhanHieu, tenTaiSan, idLoaiTaiSan} = req.body
            if (!req.filePaths) {
                return res.json(FailureResponse("25"));
            }
            const newData = new YeuCauVayVonModel({
                idLoaiTaiSan: idLoaiTaiSan,
                nhanHieu: nhanHieu,
                tenTaiSan: tenTaiSan,
                listAnhTaiSan: req.filePaths,
                customerId: req.user.id
            })
            await newData.save()
            res.json(SuccessResponse({
                message: "Tạo yêu cầu vay vốn thành công"
            }));
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("26", error))
        }
        
    }
}
module.exports = YeuCauVayVonController