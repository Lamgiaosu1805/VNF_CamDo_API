const { default: mongoose } = require("mongoose")
const redis = require("../config/connectRedis")
const BankInfoModel = require("../models/BankInfoModel")
const CustomerModel = require("../models/CustomerModel")
const NotificationTokenModel = require("../models/NotificationTokenModel")
const TKLienKetModel = require("../models/TKLienKetModel")
const YeuCauRutTienModel = require("../models/YeuCauRutTienModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")
const { sendNotification, hideUsername, formatMoney } = require("../utils/Tools")

const TransactionController = {
    getListBank: async (req, res) => {
        try {
            const {searchString} = req.query
            var listBank
            if(!searchString) {
                listBank = await BankInfoModel.find()
            }
            else {
                listBank = await BankInfoModel.find({
                    $or: [
                        { regex: { $regex: searchString, $options: "i" } }, // Tìm trong regex lưu trong DB
                        { bank_name: { $regex: searchString, $options: "i" } },
                    ]
                })
            }
            const newList = listBank.map(({ _doc }) => {
                const { icon, baseUrl, ...rest } = _doc;
                return {
                  ...rest,
                  iconUrl: baseUrl + icon
                };
            })

            res.json(SuccessResponse({
                message: "Lấy danh sách ngân hàng thành công",
                totalResult: newList.length,
                data: newList
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("50", error))
        }
    },
    addTKLienKet: async (req, res) => {
        try {
            const {otp, bankCode, bankName, customerName, stk} = req.body
            const key = `${req.user.username}:addTKNH`
            const value = await redis.get(key);
            if (!value || value !== otp) {
                return res.json(FailureResponse("11"))
            }
            const newTK = new TKLienKetModel({
                bankCode,
                bankName,
                customerName,
                customerId: req.user.id,
                stk
            })
            const count = (await TKLienKetModel.find({isDelete: false, customerId: req.user.id})).length
            const tklk = await TKLienKetModel.findOne({customerId: req.user.id, bankCode, bankName})
            if(tklk) {
                return res.json(FailureResponse("51", "Tài khoản đã tồn tại"))
            }
            if(count == 3) {
                return res.json(FailureResponse("51", "Số lượng tài khoản liên kết đã đạt tối đa"))
            }
            await newTK.save()
            redis.del(key)
            res.json(SuccessResponse({
                message: "Đã thêm tài khoản liên kết"
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("51", error))
        }
    },
    napTien: async (req, res) => {
        try {
            const {image, soTienNap} = req.body
            if(!Number.isInteger(soTienNap)) {
                return res.json(FailureResponse("49", "Số tiền nạp không đúng định dạng"))
            }
            if(!image || !soTienNap) {
                res.json(FailureResponse("48"))
            }
            else {
                const customer = await CustomerModel.findById(req.user.id)
                const soDuMoi = customer.soDuKhaDung + soTienNap
                await customer.updateOne({soDuKhaDung: soDuMoi})
                try {
                    const notification = {
                        title: "X-FINANCE",
                        content: `Tài khoản ${hideUsername(customer.username)} đã nạp thành công số tiền: ${formatMoney(soTienNap)} VNĐ\nSố dư khả dụng: ${formatMoney(soDuMoi)} VNĐ`
                    }
                    const notificationToken = await NotificationTokenModel.findOne({userId: req.user.id})
                    sendNotification([notificationToken.token], notification.title, notification.content)
                } catch (error) {
                    console.log(error)
                }
                res.json(SuccessResponse({
                    message: "Nạp tiền thành công",
                    soDuKhaDungMoi: soDuMoi
                }))
            }
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("49", error))
        }
    },
    rutTien: async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const {otp, idTKLK, soTienRut} = req.body
            const key = `${req.user.username}:rutTien`
            const value = await redis.get(key);
            if (!value || value !== otp) {
                return res.json(FailureResponse("11"))
            }
            if(!Number.isInteger(soTienRut)) {
                return res.json(FailureResponse("53", "Số tiền rút không đúng định dạng"))
            }
            const tklk = await TKLienKetModel.findOne({_id: idTKLK, customerId: req.user.id})
            if(!tklk) {
                return res.json(FailureResponse("53", "Tài khoản liên kết không tồn tại"))
            }
            const customer = await CustomerModel.findById(req.user.id)
            const yeuCauRutTien = new YeuCauRutTienModel({
                idTKLK,
                customerId: req.user.id,
                soTienRut,
                hoTenCustomer: customer.fullname
            })
            const soDuKhaDungConLai = customer.soDuKhaDung - soTienRut
            if(soDuKhaDungConLai < 0) {
                return res.json(FailureResponse("53", "Số dư khả dụng không đủ"))
            }
            await yeuCauRutTien.save({session})
            await customer.updateOne({soDuKhaDung: soDuKhaDungConLai}, {session})
            try {
                const notification = {
                    title: "X-FINANCE",
                    content: `Tài khoản ${hideUsername(customer.username)} đã yêu cầu rút thành công số tiền: ${formatMoney(soTienRut)} VNĐ, tiền sẽ về tài khoản ngân hàng của bạn trong 1 ngày làm việc.\nSố dư khả dụng: ${formatMoney(soDuKhaDungConLai)} VNĐ`
                }
                const notificationToken = await NotificationTokenModel.findOne({userId: req.user.id})
                sendNotification([notificationToken.token], notification.title, notification.content)
            } catch (error) {
                console.log(error)
            }
            await session.commitTransaction();
            session.endSession();
            await redis.del(key)
            res.json(SuccessResponse({
                message: "Tạo yêu cầu rút tiền thành công",
                soDuKhaDungConLai: soDuKhaDungConLai
            }))
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error)
            res.json(FailureResponse("53", error))
        }
    },
    layDSYeuCauRT: async (req, res) => {
        try {
            const {customerName} = req.query
            const listRT = await YeuCauRutTienModel.find({
                $or: [
                    { hoTenCustomer: { $regex: customerName || "", $options: "i" } },
                ]
            })
            res.json(SuccessResponse({
                message: "Lấy danh sách yêu cầu rút tiền thành công",
                data: listRT
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("54", error))
        }
    },
    pheDuyetYeuCauRT: async (req, res) => {
        try {
            const {idYeuCauRT} = req.body
            const yeuCauRT = await YeuCauRutTienModel.findOne({_id: idYeuCauRT, status: 1})
            
            if(!yeuCauRT) {
                console.log(yeuCauRT, "YCRT")
                return res.json(FailureResponse("55", "Không tìm thấy yêu cầu rút tiền"))
            }
            const customer = await CustomerModel.findById(yeuCauRT.customerId)
            await yeuCauRT.updateOne({status: 2, idNguoiPheDuyet: req.user.id})
            try {
                const notification = {
                    title: "X-FINANCE",
                    content: `Yêu cầu rút tiền với số tiền ${formatMoney(yeuCauRT.soTienRut)} VNĐ của bạn đã được phê duyệt.`
                }
                const notificationToken = await NotificationTokenModel.findOne({userId: customer.id})
                sendNotification([notificationToken.token], notification.title, notification.content)
            } catch (error) {
                console.log(error)
            }
            res.json(SuccessResponse({
                message: "Đã phê duyệt yêu cầu rút tiền"
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("55", error))
        }
    },
    tuChoiYeuCauRT: async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const {idYeuCauRT, lyDoTuChoi} = req.body
            if(!lyDoTuChoi) {
                return res.json(FailureResponse("56", "Lý do từ chối không được để trống"))
            }
            const yeuCauRT = await YeuCauRutTienModel.findOne({_id: idYeuCauRT, status: 1})
            if(!yeuCauRT) {
                console.log(yeuCauRT, "YCRT")
                return res.json(FailureResponse("56", "Không tìm thấy yêu cầu rút tiền"))
            }
            const customer = await CustomerModel.findById(yeuCauRT.customerId)
            await customer.updateOne({soDuKhaDung: customer.soDuKhaDung + yeuCauRT.soTienRut}, {session})
            await yeuCauRT.updateOne({status: 3, idNguoiPheDuyet: req.user.id, lyDoTuChoi: lyDoTuChoi}, {session})
            try {
                const notification = {
                    title: "X-FINANCE",
                    content: `Yêu cầu rút tiền với số tiền ${formatMoney(yeuCauRT.soTienRut)} VNĐ của bạn đã bị từ chối với lí do: ${lyDoTuChoi}.\nSố tiền đã được trả về tài khoản X-FINANCE của bạn\nSố dư khả dụng: ${formatMoney(customer.soDuKhaDung + yeuCauRT.soTienRut)} VNĐ`
                }
                const notificationToken = await NotificationTokenModel.findOne({userId: customer.id})
                sendNotification([notificationToken.token], notification.title, notification.content)
            } catch (error) {
                console.log(error)
            }
            await session.commitTransaction();
            session.endSession();
            res.json(SuccessResponse({
                message: "Đã từ chối yêu cầu rút tiền"
            }))
        } catch (error) {
            await session.commitTransaction();
            session.endSession();
            console.log(error)
            res.json(FailureResponse("56", error))
        }
    },
}
module.exports = TransactionController