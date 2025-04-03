const BankInfoModel = require("../models/BankInfoModel")
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
    }
}
module.exports = TransactionController