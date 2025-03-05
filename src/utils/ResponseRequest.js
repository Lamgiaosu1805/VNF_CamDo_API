const HandleErrorCode = require("./HandleErrorCode")

const SuccessResponse = (data) => {
    return {
        status: true,
        result: data
    }
}

const FailureResponse = (errorCode, error) => {
    return {
        status: false,
        errorCode: errorCode,
        message: HandleErrorCode(errorCode),
        error: error?.toString()
    }
}
module.exports = {SuccessResponse, FailureResponse}