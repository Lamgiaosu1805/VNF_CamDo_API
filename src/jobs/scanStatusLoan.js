const cron = require('node-cron');
const KyVayModel = require('../models/KyVayModel');
const KhoanVayModel = require('../models/KhoanVayModel');
const NotificationUserModel = require('../models/NotificationUserModel');
const NotificationTokenModel = require('../models/NotificationTokenModel');
const { default: mongoose } = require('mongoose');
const { default: Expo } = require('expo-server-sdk');
const { sendNotification } = require('../utils/Tools');

module.exports = () => {
    cron.schedule('0 * * * *', async () => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const result = await KhoanVayModel.aggregate([
                {
                    $lookup: {
                        from: 'kyvays',
                        localField: 'soHopDong',
                        foreignField: 'soHopDong',
                        as: 'kyVayList'
                    }
                },
                {
                    $addFields: {
                        kyVayQuaHan: {
                            $filter: {
                                input: {
                                    $map: {
                                        input: '$kyVayList',
                                        as: 'ky',
                                        in: {
                                            $mergeObjects: [
                                                '$$ky',
                                                {
                                                    ngayTraNoDate: {
                                                        $dateFromString: {
                                                            dateString: '$$ky.ngayTraNo',
                                                            format: '%d/%m/%Y'
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                },
                                as: 'kyConverted',
                                cond: {
                                    $and: [
                                        { $lt: ['$$kyConverted.ngayTraNoDate', today] },
                                        { $eq: ['$$kyConverted.trangThai', 1] }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $addFields: {
                        tongSoTienConNo: {
                            $reduce: {
                                input: '$kyVayQuaHan',
                                initialValue: 0,
                                in: {
                                    $add: [
                                        '$$value',
                                        { $subtract: ['$$this.soTienCanTra', '$$this.soTienDaTra'] }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    $match: {
                        'kyVayQuaHan.0': { $exists: true }
                    }
                }
            ]).session(session);

            const kyVayIdsToUpdate = result.flatMap(kv => kv.kyVayQuaHan.map(ky => ky._id));

            if (kyVayIdsToUpdate.length > 0) {
                await KyVayModel.updateMany(
                    { _id: { $in: kyVayIdsToUpdate } },
                    { $set: { quaHan: true } },
                    { session }
                );
            }

            // Tạo thông báo và lưu NotificationUser
            const customerIds = result.map(kv => kv.customerId);

            const notificationTokens = await NotificationTokenModel.find(
                { userId: { $in: customerIds } },
                { userId: 1, token: 1 }
            ).lean();

            const customerTokenMap = Object.fromEntries(
                notificationTokens.map(t => [t.userId.toString(), t.token])
            );

            const messages = [];
            const notifications = [];

            for (const kv of result) {
                const token = customerTokenMap[kv.customerId];
                const content = `Khoản vay có số hợp đồng: ${kv.soHopDong} đang trễ hạn thanh toán.\nSố tiền cần thanh toán: ${kv.tongSoTienConNo.toLocaleString()} VNĐ`;

                // Lưu vào NotificationUser
                notifications.push({
                    userId: kv.customerId,
                    isAdmin: false,
                    title: 'Thông báo trễ hạn khoản vay',
                    content,
                    type: 2,
                });

                if (token && Expo.isExpoPushToken(token)) {
                    messages.push({
                        to: token,
                        sound: 'default',
                        title: 'Thông báo trễ hạn khoản vay',
                        body: content,
                        data: { soHopDong: kv.soHopDong }
                    });
                }
            }

            if (notifications.length > 0) {
                await NotificationUserModel.insertMany(notifications, { session });
            }

            await session.commitTransaction();
            session.endSession();

            if (messages.length > 0) {
                sendNotification('', '', '', messages);
            }
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            session.endSession();
        }
    });
};
