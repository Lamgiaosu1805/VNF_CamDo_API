const { FailureResponse } = require("../utils/ResponseRequest");

const validateDeviceId = async (req, res, next) => {
    const deviceId = req.headers.deviceid
    if (!deviceId) {
        return res.json(FailureResponse("03"))
    }
    req.deviceId = deviceId
    next();
}

module.exports = validateDeviceId