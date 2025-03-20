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
            const listData = await YeuCauVayVonModel
                .find()
                .populate("idLoaiTaiSan").sort({ createdAt: -1 })
                .select("-idNguoiPheDuyet -idNguoiGiaiNgan")
                .lean()
                .then((results) =>
                    results.map((item) => ({
                    ...item,
                    loaiTaiSanInfo: {
                        _id: item.idLoaiTaiSan?._id,
                        ten: item.idLoaiTaiSan?.ten,
                    },
                    idLoaiTaiSan: undefined,
                    }))
                );

            res.json(SuccessResponse({
                message: "Lấy danh sách yêu cầu thành công",
                data: listData
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("32"))
        }
    },
    guiYeuCauGiaiNgan: async (req, res) => {
        try {
            const user = req.user
            const {idYeuCau} = req.body
            await YeuCauVayVonModel.findByIdAndUpdate(idYeuCau, {status: 3, idNguoiPheDuyet: user.id})
            res.json(SuccessResponse({
                message: "Gửi yêu cầu giải ngân thành công"
            }))
        } catch (error) {
            res.json(FailureResponse("33", error))
            console.log(error)
        }
    }
}
module.exports = YeuCauVayVonController