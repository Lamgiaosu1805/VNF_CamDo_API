const AdminAccountModel = require("../models/AdminAccountModel")
const NotificationUserModel = require("../models/NotificationUserModel")
const { SuccessResponse, FailureResponse } = require("../utils/ResponseRequest")

const AdminController = {
    getAccountInfo: async (req, res) => {
        try {
            const accountInfo = await AdminAccountModel.findById(req.user.id).select("-password")
            const soTBChuaDoc = await NotificationUserModel.countDocuments({userId: req.user.id, isSeen: false})
            res.json(SuccessResponse({
                message: "Lấy thông tin thành công",
                soTBChuaDoc,
                data: accountInfo
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("69", error))
        }
    }
}

module.exports = AdminController