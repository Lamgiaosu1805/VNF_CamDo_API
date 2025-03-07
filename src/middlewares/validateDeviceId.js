const { FailureResponse } = require("../utils/ResponseRequest");

const validateDeviceId = async (req, res, next) => {
    const deviceId = req.headers.deviceId
    
    if (!deviceId) {
        return res.json(FailureResponse("03"))
    }

    next();
}

module.exports = validateDeviceId