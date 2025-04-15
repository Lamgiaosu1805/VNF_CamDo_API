const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone')

const NotificationUser = new Schema({
    userId: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    isSeen: { type: Boolean, default: false },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: Number, required: true },
    //type=1 : Thông báo giao dịch
    //type=2 : Thông báo khoản vay
    //type=3 : Thông báo Khuyến mại
    //type=4 : Thông báo hệ thống
    isDelete: { type: Boolean, default: false },
    createdAt: {
        type: String,
        default: () => moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format(), // Tự động lưu với múi giờ +7
    },
    updatedAt: {
        type: String,
        default: () => moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format(), // Tự động lưu với múi giờ +7
    },
}, {
    timestamps: false
})

NotificationUser.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    const now = moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format();
    this.set({ updatedAt: now }); // Cập nhật trường updatedAt với thời gian hiện tại ở múi giờ Việt Nam
    next();
});

module.exports = mongoose.model('notificationUser', NotificationUser)