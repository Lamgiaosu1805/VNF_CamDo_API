const redis = require("../config/connectRedis")
const BankInfoModel = require("../models/BankInfoModel")
const TKLienKetModel = require("../models/TKLienKetModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")

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
    }
}
module.exports = TransactionController