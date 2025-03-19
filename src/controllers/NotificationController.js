const CustomerDeviceHistoryModel = require("../models/CustomerDeviceHistoryModel")
const NotificationTokenModel = require("../models/NotificationTokenModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")
const { default: mongoose } = require("mongoose")
const { sendNotification } = require('../utils/Tools')

const NotificationController = {
    saveToken: async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction();
        try {
            const {deviceToken, OS, deviceName} = req.body
            const data = await NotificationTokenModel.findOne({userId: req.user.id})
            const dataUserDevice = await CustomerDeviceHistoryModel.findOne({userId: req.user.id, deviceId: req.deviceId})
            if(dataUserDevice) {
                await dataUserDevice.updateOne(req.body, {session})
            }
            else {
                const newDataUserDevice = new CustomerDeviceHistoryModel({
                    userId: req.user.id,
                    deviceId: req.deviceId,
                    deviceName: deviceName,
                    OS: OS
                })
                await newDataUserDevice.save({session})
            }
            if(data) {
                await data.updateOne({token: deviceToken}, {session})
            }
            else {
                const newData = new NotificationTokenModel({
                    userId: req.user.id,
                    token: deviceToken
                })
                await newData.save({session})
            }
            await session.commitTransaction();
            session.endSession();
            res.json(SuccessResponse({
                message: "Cập nhật token và tên thiết bị thành công"
            }))
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error)
            res.json(FailureResponse("30", error))
        }
    },
    pushNotification: async (req, res, next) => {
        const {deviceToken, title, content} = req.body
        try {
            sendNotification(deviceToken, title, content)
            res.json(SuccessResponse({
                message: "Đã gửi thông báo"
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("31", error))
        }
    },
}

module.exports = NotificationController