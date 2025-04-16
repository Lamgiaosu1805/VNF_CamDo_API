const CustomerDeviceHistoryModel = require("../models/CustomerDeviceHistoryModel")
const NotificationTokenModel = require("../models/NotificationTokenModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")
const { default: mongoose } = require("mongoose")
const { sendNotification } = require('../utils/Tools')
const messaging = require('../../firebase');
const NotificationAdminTokenModel = require("../models/NotificationAdminTokenModel")
const NotificationUserModel = require("../models/NotificationUserModel")

const NotificationController = {
    saveToken: async (req, res) => {
        const session = await mongoose.startSession()
        session.startTransaction();
        try {
            const { deviceToken, OS, deviceName } = req.body
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
    testFirebasePush: async (req, res) => {
        const message = {
            token: req.body.deviceToken,
            notification: {
              title: req.body.title,
              body: req.body.content,
            },
            android: {
              priority: 'high',
            },
            apns: {
              payload: {
                aps: {
                  sound: 'default',
                },
              },
            },
          };
        
          try {
            const response = await messaging.send(message);
            console.log('✅ Notification sent:', response);
            res.send("s")
          } catch (error) {
            console.error('❌ Error sending notification:', error);
            res.send("Lỗi")
          }
    },
    saveFirebaseTokenAdmin: async (req, res) => {
        try {
            const {firebaseToken} = req.body
            const notificationToken = await NotificationAdminTokenModel.findOne({userId: req.user.id, firebaseToken})
            if(!notificationToken) {
                const noti = new NotificationAdminTokenModel({
                    firebaseToken,
                    userId: req.user.id
                })
                await noti.save()
            }
            res.json(SuccessResponse({
                message: "Save firebase token thành công"
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("63", error))
        }
    },
    getNotification: async (req, res) => {
        try {
            const {type} = req.query
            const isAdmin = req.isAdmin
            const userId = req.user.id
            const notifications = await NotificationUserModel.find({type, userId, isAdmin}).sort({ createdAt: -1 })
            res.json(SuccessResponse({
                message: "Lấy danh sách thông báo thành công",
                data: notifications
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("64", error))
        }
    }
}

module.exports = NotificationController