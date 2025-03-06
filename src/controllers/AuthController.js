const CustomerModel = require("../models/CustomerModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")

const AuthController = {
    validatePhoneNumber: async (req, res) => {
        const {body} = req
        try {
            const customer = await CustomerModel.findOne({username: body.phoneNumber})
            if(body.phoneNumber?.toString().length != 10) {
                res.json(FailureResponse("02"))
                return
            }
            res.json(SuccessResponse({
                isCustomer: customer ? true : false
            }))
        } catch (error) {
            console.log(error)
            FailureResponse("01", error)
        }
    }
}

module.exports = AuthController