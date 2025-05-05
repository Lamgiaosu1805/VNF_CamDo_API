const { default: mongoose } = require("mongoose")
const redis = require("../config/connectRedis")
const KhoanVayModel = require("../models/KhoanVayModel")
const KyVayModel = require("../models/KyVayModel")
const { SuccessResponse, FailureResponse } = require("../utils/ResponseRequest")
const CustomerModel = require("../models/CustomerModel")
const LichSuGiaoDichModel = require("../models/LichSuGiaoDichModel")
const { formatMoney, sendNotification } = require("../utils/Tools")
const NotificationTokenModel = require("../models/NotificationTokenModel")
const NotificationUserModel = require("../models/NotificationUserModel")

const KhoanVayController = {
    layDanhSachKhoanVayCustomer: async (req, res) => {
        try {
            const keyRedis = `DSKhoanVayCustomer:${req.user.id}`
            const responseRedis = await redis.get(keyRedis)
            var data
            if(!responseRedis) {
                console.log("DSKV: FROM DB")
                const listData = await KhoanVayModel.aggregate([
                    {
                        $lookup: {
                            from: "kyvays",
                            localField: "soHopDong",
                            foreignField: "soHopDong",
                            as: "kyTraNo"
                        }
                    }, {
                        $match: {
                            customerId: req.user.id
                        }
                    }
                ]).sort({ createdAt: -1 })
                const filteredData = listData.map((e) => {
                    const today = new Date();
                    const ngayGanNhat = e.kyTraNo
                        .map(ele => {
                            const [day, month, year] = ele.ngayTraNo.split("/").map(Number);
                            return new Date(year, month - 1, day);
                        })
                        .filter(date => date > today)
                        .sort((a, b) => a - b)[0]
                    var cacKyTruocChuaTT = e.kyTraNo.filter(ele => {
                        const [day, month, year] = ele.ngayTraNo.split("/").map(Number);
                        const date = new Date(year, month - 1, day);
                        return (date < ngayGanNhat && ele.trangThai == 1);
                    });
                    const cacKyTruocDaTT = e.kyTraNo.filter(ele => {
                        return ele.trangThai == 2;
                    });
                    const tongSoTienThieu = cacKyTruocChuaTT.reduce((sum, ele) => {
                        return sum + (ele.soTienCanTra - ele.soTienDaTra);
                    }, 0);
                    const kyToi = e.kyTraNo.find(ele => {
                        const [d, m, y] = ele.ngayTraNo.split("/").map(Number);
                        const date = new Date(y, m - 1, d);
                        return date.getTime() === ngayGanNhat.getTime();
                    });
                    cacKyTruocChuaTT.push(kyToi)
                    const soTienCanTraKyToi = kyToi ? kyToi.soTienCanTra : 0;
                    const soTienDaTraKyToi = kyToi ? kyToi.soTienDaTra : 0;
                    const tongCanTra = soTienCanTraKyToi -  soTienDaTraKyToi + tongSoTienThieu;
                    return {
                        idKhoanVay: e._id,
                        soHopDong: e.soHopDong,
                        trangThai: e.status,
                        soTienVay: e.chiTietKhoanVay.soTienVay,
                        soTienCanTra: e.chiTietKhoanVay.soTienCanTra,
                        soTienConLai: e.chiTietKhoanVay.soTienCanTra - e.kyTraNo.reduce((tong, item) => tong + item.soTienDaTra, 0),
                        ngayDenHan: ngayGanNhat ? ngayGanNhat.toLocaleDateString('vi-VN') : e.kyTraNo.at(-1),
                        soTienCanThanhToan: tongCanTra,
                        cacKyCanTT : cacKyTruocChuaTT,
                        cacKyTruocDaTT
                    }
                })
                data = filteredData
                await redis.set(keyRedis, JSON.stringify(filteredData), "EX", 3600 * 24)
            }
            else {
                console.log("DSKV: FROM REDIS")
                data = JSON.parse(responseRedis)
            }
            
            res.json(SuccessResponse({
                message: "Lấy danh sách khoản vay thành công",
                data: data
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("45", error))
        }
    },
    layDanhSachKhoanVayAdmin: async (req, res) => {
        try {
            const {status, isOutDate} = req.query
            var listData
            if(isOutDate == 1) {
                const redisData = await redis.get("listKVQuaHan")
                listData = JSON.parse(redisData)
            }
            else {
                listData = await KhoanVayModel.find({status: status}).sort({ createdAt: -1 })
                .populate('customerId')
                .lean()
                .then((results) =>
                    results.map((item) => ({
                        ...item,
                        customerInfo: {
                            phoneNumber: item.customerId?.username,
                            fullname:  item.customerId?.fullname || "",
                        },
                        customerId: undefined,
                    }))
                );
            }  
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
                message: "Lấy chi tiết khoản vay thành công",
                dataKhoanVay: khoanVay,
                kyTraNo
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("61", error))
        }
    },
    thanhToanNo: async (req, res) => {
        const {soTienThanhToan, idKhoanVay, otp} = req.body
        const customer = req.customer
        const session = await mongoose.startSession();
        session.startTransaction();
        let soTienConLai = soTienThanhToan;
        try {
            const keyRedisOTP = `${req.user.username}:thanhToanNo`
            const value = await redis.get(keyRedisOTP);
            if (!value || value !== otp) {
                session.endSession();
                return res.json(FailureResponse("11"))
            }
            if(!Number.isInteger(soTienThanhToan)) {
                return res.json(FailureResponse("62", "Số tiền thanh toán không đúng định dạng"))
            }
            if(soTienThanhToan > customer.soDuKhaDung) {
                return res.json(FailureResponse("62", "Số tiền khả dụng không đủ"))
            }
            const keyRedis = `DSKhoanVayCustomer:${req.user.id}`
            const responseRedis = await redis.get(keyRedis)
            if(!responseRedis) {
                return res.json(FailureResponse("62", "Khoản vay không còn tồn tại"))
            }
            const khoanVay = JSON.parse(responseRedis).find((e) => e.idKhoanVay == idKhoanVay)
            if(soTienThanhToan > khoanVay.soTienCanThanhToan) {
                return res.json(FailureResponse("62", "Số tiền thanh toán không được lớn hơn số tiền cần trả của kỳ"))
            }
            for (const ky of khoanVay.cacKyCanTT) {
                if (soTienConLai <= 0) break;
          
                const conLaiCuaKy = ky.soTienCanTra - ky.soTienDaTra;
                let soTienCongVaoKy = 0;
          
                if (soTienConLai >= conLaiCuaKy) {
                  soTienCongVaoKy = conLaiCuaKy;
                  ky.soTienDaTra = ky.soTienCanTra;
                  ky.trangThai = 2;
                } else {
                  soTienCongVaoKy = soTienConLai;
                  ky.soTienDaTra += soTienCongVaoKy;
                  // vẫn giữ trạng thái = 1
                }
                const ngayHomNay = new Date();
                // const ngayStr = ngayHomNay.toLocaleDateString('vi-VN'); // ví dụ: 15/04/2025
                const formatter = new Intl.DateTimeFormat('vi-VN', {
                    timeZone: 'Asia/Ho_Chi_Minh',
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });
                const timeVN = formatter.format(ngayHomNay);
                const logTra = `Đã thanh toán ${soTienCongVaoKy.toLocaleString('vi-VN')} VNĐ vào ${timeVN}`;
                await KyVayModel.updateOne(
                  { _id: ky._id },
                  {
                    $set: {
                      soTienDaTra: ky.soTienDaTra,
                      trangThai: ky.trangThai
                    },
                    $push: {
                      lichSuTra: logTra
                    }
                  },
                  { session }
                );
                soTienConLai -= soTienCongVaoKy;
            }
            const lichSuGD = new LichSuGiaoDichModel({
                customerId: customer._id,
                soTienGiaoDich: soTienThanhToan,
                tieuDeGiaoDich: `Thanh toán khoản vay`,
                noiDungGiaoDich: `Thanh toán dư nợ của hợp đồng số ${khoanVay.soHopDong}.\nSố dư khả dụng: ${formatMoney(customer.soDuKhaDung - soTienThanhToan)} VNĐ`,
                type: 1
            })
            await lichSuGD.save({session})
            await CustomerModel.updateOne({_id: customer._id}, {soDuKhaDung: customer.soDuKhaDung - soTienThanhToan}, {session})
            if(khoanVay.soTienConLai - soTienThanhToan == 0) {
                console.log(`Đã tất toán khoản vay của hợp đồng ${khoanVay.soHopDong}`)
                try {
                    const notification = {
                        title: "X-FINANCE",
                        content: `Hợp đồng số ${khoanVay.soHopDong} đã hoàn thành tất toán.`,
                    }
                    const notificationToken = await NotificationTokenModel.findOne({userId: req.user.id})
                    sendNotification([notificationToken.token], notification.title, notification.content)
                    const notificationUser = new NotificationUserModel({
                        userId: customer._id,
                        isAdmin: false,
                        title: "Tất toán khoản vay",
                        content: `Hợp đồng số ${khoanVay.soHopDong} đã hoàn thành tất toán.`,
                        type: 2
                    })
                    await notificationUser.save()
                } catch (error) {
                    console.log(error)
                }
                await KhoanVayModel.updateOne({_id: khoanVay.idKhoanVay}, {status: true}, {session})
            }
            await session.commitTransaction();
            session.endSession();
            try {
                const notification = {
                    title: "X-FINANCE",
                    content: `Thanh toán dư nợ của hợp đồng số ${khoanVay.soHopDong} thành công.\nSố dư khả dụng: ${formatMoney(customer.soDuKhaDung - soTienThanhToan)} VNĐ`,
                }
                const notificationToken = await NotificationTokenModel.findOne({userId: req.user.id})
                sendNotification([notificationToken.token], notification.title, notification.content)
                const notificationUser = new NotificationUserModel({
                    userId: customer._id,
                    isAdmin: false,
                    title: "Thanh toán toán khoản vay",
                    content: `Thanh toán dư nợ của hợp đồng số ${khoanVay.soHopDong} thành công.\nSố dư khả dụng: ${formatMoney(customer.soDuKhaDung - soTienThanhToan)} VNĐ`,
                    type: 2
                })
                await notificationUser.save()
            } catch (error) {
                console.log(error)
            }
            await redis.del(keyRedis)
            await redis.del(keyRedisOTP)
            res.json(SuccessResponse({
                message: "Thanh toán dư nợ thành công",
            }))
        } catch (error) {
            res.json(FailureResponse("62", error))
            console.log(error)
        }
    }
}
module.exports = KhoanVayController