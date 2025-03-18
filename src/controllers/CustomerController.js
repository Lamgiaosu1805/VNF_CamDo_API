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
    }
}
module.exports = CustomerController