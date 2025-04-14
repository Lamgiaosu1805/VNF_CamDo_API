const redis = require("../config/connectRedis")
const KhoanVayModel = require("../models/KhoanVayModel")
const KyVayModel = require("../models/KyVayModel")
const { SuccessResponse, FailureResponse } = require("../utils/ResponseRequest")

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
                ])
                const filteredData = listData.map((e) => {
                    const today = new Date();
                    const ngayGanNhat = e.kyTraNo
                        .map(ele => {
                            const [day, month, year] = ele.ngayTraNo.split("/").map(Number);
                            return new Date(year, month - 1, day);
                        })
                        .filter(date => date > today)
                        .sort((a, b) => a - b)[0]
                    const cacKyTruoc = e.kyTraNo.filter(ele => {
                        const [day, month, year] = ele.ngayTraNo.split("/").map(Number);
                        const date = new Date(year, month - 1, day);
                        return date < ngayGanNhat;
                    });
                    const tongSoTienThieu = cacKyTruoc.reduce((sum, ele) => {
                        return sum + (ele.soTienCanTra - ele.soTienDaTra);
                    }, 0);
                    const kyToi = e.kyTraNo.find(ele => {
                        const [d, m, y] = ele.ngayTraNo.split("/").map(Number);
                        const date = new Date(y, m - 1, d);
                        return date.getTime() === ngayGanNhat.getTime();
                    });
                    const soTienCanTraKyToi = kyToi ? kyToi.soTienCanTra : 0;
                    const soTienDaTraKyToi = kyToi ? kyToi.soTienDaTra : 0;
                    const tongCanTra = soTienCanTraKyToi -  soTienDaTraKyToi + tongSoTienThieu;
                    return {
                        idKhoanVay: e._id,
                        soHopDong: e.soHopDong,
                        soTienVay: e.chiTietKhoanVay.soTienVay,
                        soTienConLai: e.chiTietKhoanVay.soTienVay - e.kyTraNo.reduce((tong, item) => tong + item.soTienDaTra, 0),
                        ngayDenHan: ngayGanNhat ? ngayGanNhat.toLocaleDateString('vi-VN') : e.kyTraNo.at(-1),
                        soTienCanThanhToan: tongCanTra
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
            const listData = await KhoanVayModel.find()
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