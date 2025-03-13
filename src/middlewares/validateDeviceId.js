const CustomerModel = require("../models/CustomerModel");
const { FailureResponse } = require("../utils/ResponseRequest");

const validateDevice = {

    checkNullDeviceId: (req, res, next) => {
        const deviceId = req.headers.deviceid
        if (!deviceId) {
            return res.json(FailureResponse("03"))
        }
        req.deviceId = deviceId
        next();
    },

    checkSameDeviceId: (req, res, next) => {
        validateDevice.checkNullDeviceId(req, res, async () => {
            try {
                const user = req.user
                const customer = await CustomerModel.findOne({deviceId: req.deviceId, username: user?.username ?? req.body.username})
                if(customer) {
                    req.customer = customer
                    next()
                }
                else {
                    res.json(FailureResponse("09"))
                }
            } catch (error) {
                console.log(error)
                res.json(FailureResponse("10", error))
            }
        })
    }
}

module.exports = validateDevice