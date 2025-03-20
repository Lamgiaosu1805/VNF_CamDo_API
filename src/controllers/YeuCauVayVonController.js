const NotificationTokenModel = require("../models/NotificationTokenModel");
const YeuCauVayVonModel = require("../models/YeuCauVayVonModel");
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest");
const { sendNotification } = require("../utils/Tools");

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
                namSX: namSX,
                maYeuCau: "VNF" + Date.now() + '-' + Math.round(Math.random() * 1E9)
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
    },
    thamDinh: async (req, res) => {
        var response
        try {
            const user = req.user
            const {idYeuCau, giaTriThamDinh} = req.body
            response = await YeuCauVayVonModel.findByIdAndUpdate(idYeuCau, {status: 2, idNguoiThamDinh: user.id, giaTriSauThamDinh: giaTriThamDinh})
            if(!response) {
                return res.json(FailureResponse("35"))
            }
            res.json(SuccessResponse({
                message: "Đã thẩm định"
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("34", error))
        }
        try {
            if(response) {
                //Thiếu create Noti để sau
                const notification = {
                    title: "X-FINANCE",
                    content: `Yêu cầu vay vốn mã ${response.maYeuCau} đã được thẩm định. Vui lòng vào app để xem chi tiết giá trị thẩm định`
                }
                const notificationToken = await NotificationTokenModel.findOne({userId: response.customerId})
                sendNotification([notificationToken.token], notification.title, notification.content)
            }
        } catch (error) {
            console.log(error)
        }
    },
    tinhTien: (req, res) => {
        try {
            //Lãi Suất 12% / 1 năm = so tien vay * (12/100) * (so ngay vay / 365) = tien lai
            //tien goc so tien vay / so thang vay
            //tong tra du kien = 2 cai tren
            const {tongTienVay, soKy, donVi} = req.body
            const monthlyRate = 12/12/100;
            const soTienGocHangThang = tongTienVay / soKy
            const soTienLaiHangThang = tongTienVay * monthlyRate
            const monthlyPayment = soTienGocHangThang + soTienLaiHangThang
            const soTienBaoHiem = 0
            const soTienDuocGiaiNgan = tongTienVay - soTienBaoHiem
            res.json(SuccessResponse({
                message: "Thành công",
                data: {
                    soKyTraNo: soKy,
                    tongSoTienVay: tongTienVay,
                    tongSoTienPhaiTra: monthlyPayment * soKy,
                    soTienGocHangThang: soTienGocHangThang,
                    soTienLaiHangThang: soTienLaiHangThang,
                    soTienTraHangThang: monthlyPayment,
                    soTienBaoHiem: soTienBaoHiem,
                    soTienDuocGiaiNgan: soTienDuocGiaiNgan,
                    donVi: donVi //Đơn vị mặc định là VNĐ
                }
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("36", error))
        }
    }
}
module.exports = YeuCauVayVonController