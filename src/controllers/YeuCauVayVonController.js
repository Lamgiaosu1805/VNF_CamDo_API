const NotificationTokenModel = require("../models/NotificationTokenModel");
const YeuCauVayVonModel = require("../models/YeuCauVayVonModel");
const moment = require('moment');
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
            const {status} = req.query
            const listData = await YeuCauVayVonModel
                .find({customerId: req.user.id, status: status})
                .populate("idLoaiTaiSan").sort({ createdAt: -1 })
                .select("-idNguoiPheDuyet -idNguoiGiaiNgan")
                .lean()
                .then((results) =>
                    results.map((item) => ({
                    ...item,
                    loaiTaiSanInfo: {
                        _id: item.idLoaiTaiSan?._id,
                        ten: item.idLoaiTaiSan?.ten,
                        type: item.idLoaiTaiSan?.type
                    },
                    idLoaiTaiSan: undefined,
                    }))
                );
            var response = {
                message: "Lấy danh sách yêu cầu thành công",
                data: listData
            }
            if(status == 6 && listData.length > 0) {
                response.linkHopDong = "https://danhgiaxe.edu.vn/upload/2025/01/meme-bua-038.webp"
            } 
            res.json(SuccessResponse(response))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("32"))
        }
    },
    guiYeuCauGiaiNgan: async (req, res) => {
        try {
            const user = req.user
            const {idYeuCau, soKyTraNo} = req.body
            if(soKyTraNo <= 0 || !soKyTraNo) {
                return res.json(FailureResponse("39"))
            }
            const yeuCau = await YeuCauVayVonModel.findOneAndUpdate({_id: idYeuCau, status: 2}, {status: 3, idNguoiPheDuyet: user.id, soKyTraNo: soKyTraNo})
            if(!yeuCau) {
                return res.json(FailureResponse("35"))
            }
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
    },
    getYCGoiVonAdmin: async (req, res) => {
        try {
            const {status} = req.query
            const danhSachYc = await YeuCauVayVonModel.find({status: status})
            res.json(SuccessResponse({
                message: "Lấy danh sách thành công",
                data: danhSachYc
            }))
        } catch (error) {
            console.log(error),
            res.json(FailureResponse("37", error))
        }
    },
    dongYGiaiNgan: async (req, res) => {
        var response
        try {
            const {idYeuCau} = req.body
            const yeuCau = await YeuCauVayVonModel.findOne({_id: idYeuCau, status: 3})
            if(!yeuCau) {
                return res.json(FailureResponse("35"))
            }
            const soKy = yeuCau.soKyTraNo
            const totalMoney = yeuCau.giaTriSauThamDinh * (1 + 0.12)
            const today = moment();
            const ngayTraNo = today.date();

            let dueDates = [];

            let baseAmount = Math.floor(totalMoney / soKy);
            let remainder = Math.round(totalMoney - baseAmount * soKy);

            for (let i = 1; i <= soKy; i++) {
                let dueDate = today.clone().add(i, 'months').date(ngayTraNo).format('DD/MM/YYYY');
                let amount = baseAmount;
                
                if (i === 1) {
                    amount += remainder; // Tháng đầu tiên nhận phần lẻ
                }

                amount = Math.round(amount);
                dueDates.push({
                    customerId: yeuCau.customerId,
                    maYeuCau: yeuCau.maYeuCau,
                    ky: i,
                    ngayTraNo: dueDate,
                    soTienCanTra: amount,
                });
            }
            response = await yeuCau.updateOne({status: 6, idNguoiGiaiNgan: req.user.id, kyTraNo: dueDates})
            res.json(SuccessResponse({
                message: "Đã đồng ý giải ngân, hợp đồng đã được gửi",
            }));
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("41", error))
        }
        try {
            if(response) {
                //Thiếu create Noti để sau
                const notification = {
                    title: "X-FINANCE",
                    content: `Yêu cầu vay vốn mã ${response.maYeuCau} đã được đồng ý giải ngân. Vui lòng vào app ký hợp đồng để giải ngân`
                }
                const notificationToken = await NotificationTokenModel.findOne({userId: response.customerId})
                sendNotification([notificationToken.token], notification.title, notification.content)
            }
        } catch (error) {
            console.log(error)
        }
    }

}
module.exports = YeuCauVayVonController