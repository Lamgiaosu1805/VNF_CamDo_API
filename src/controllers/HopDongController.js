const { default: mongoose } = require("mongoose");
const YeuCauVayVonModel = require("../models/YeuCauVayVonModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest");
const HopDongModel = require("../models/HopDongModel");
const KyVayModel = require("../models/KyVayModel");
const KhoanVayModel = require("../models/KhoanVayModel");
const CustomerModel = require("../models/CustomerModel");
const NotificationTokenModel = require("../models/NotificationTokenModel");
const { sendNotification, hideUsername, formatMoney } = require("../utils/Tools");

const HopDongController = {
    kyHopDong: async(req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const {idYeuCau} = req.body
            const customerId = req.user.id
            const yeuCau = await YeuCauVayVonModel.findOne({_id: idYeuCau, customerId: customerId, status: 6})
            if(!yeuCau) {
                return res.json(FailureResponse("35"))
            }
            const soLuongHopDong = await HopDongModel.countDocuments() + 1
            const soHopDong = `${soLuongHopDong}-2025/HĐ-TCTS`
            const kyTraNo = yeuCau.kyTraNo
            const kyVay = kyTraNo.map((e) => {
                return {
                    soHopDong: soHopDong,
                    customerId: customerId,
                    ky: e.ky,
                    ngayTraNo: e.ngayTraNo,
                    soTienCanTra: e.soTienCanTra,
                }
            })
            const newHopDong = new HopDongModel({
                soHopDong: soHopDong,
                customerId: customerId,
                linkHopDong: "https://danhgiaxe.edu.vn/upload/2025/01/meme-bua-038.webp",
            })
            await newHopDong.save({session})
            const chiTietKhoanVay = {
                soTienVay: yeuCau.giaTriSauThamDinh,
                soTienCanTra: Math.round(yeuCau.giaTriSauThamDinh * (1 + 0.12)),
                soTienbaoHiem: 0,
                soTienDuocGiaiNgan: yeuCau.giaTriSauThamDinh - 0,
                laiXuat: "12%/năm",
            }
            const newKhoanVay = new KhoanVayModel({
                soHopDong: soHopDong,
                customerId: customerId,
                maYeuCau: yeuCau.maYeuCau,
                chiTietKhoanVay: chiTietKhoanVay
            })
            await newKhoanVay.save({session})
            const customer = await CustomerModel.findById(customerId)
            const SDKhaDung = customer.soDuKhaDung || 0
            const SDmoi = SDKhaDung + chiTietKhoanVay.soTienDuocGiaiNgan
            await customer.updateOne({soDuKhaDung: SDmoi})
            //==============================================================================================
            const checkTonTai = await KyVayModel.findOne({soHopDong: soHopDong})
            if(!checkTonTai) {
                await KyVayModel.insertMany(kyVay, {session})
                // return res.json(FailureResponse("43"))
            }
            response = await yeuCau.updateOne({status: 4})
            await session.commitTransaction();
            session.endSession();
            try {
                //Thiếu create Noti để sau
                const notification = {
                    title: "X-FINANCE",
                    content: `Hợp đồng số ${soHopDong} đã được giải ngân vào tài khoản ${hideUsername(customer.username)}\nSố dư khả dụng: ${formatMoney(SDmoi)}`
                }
                const notificationToken = await NotificationTokenModel.findOne({userId: customerId})
                sendNotification([notificationToken], notification.title, notification.content)
            } catch (error) {
                console.log(error)
            }
            res.json(SuccessResponse({
                message: "Ký hợp đồng thành công, số tiền sẽ được giải ngân trong 1 ngày làm việc"
            }))
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error)
            res.json(FailureResponse("42", error))
        }
    },
}

module.exports = HopDongController