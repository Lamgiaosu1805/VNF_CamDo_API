const CustomerModel = require("../models/CustomerModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")

const CustomerController = {
    ekyc: async(req, res, next) => {
        try {
            await CustomerModel.findByIdAndUpdate(req.user.id, {isEkyc: true})
            res.json(SuccessResponse({
                message: "EKYC thành công"
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("", error))
        }
    },
    getCustomerInfo: async (req, res) => {
        try {
            const customerInfo = await CustomerModel.findById(req.user.id).select("-password -firebaseToken")
            res.json(SuccessResponse({
                message: "Lấy thông tin thành công",
                data: customerInfo
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("38", error))
        }
    }
}
module.exports = CustomerController