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
        validateDevice.checkNullDeviceId(req, res, () => {
            
        })
    }
}

module.exports = validateDevice