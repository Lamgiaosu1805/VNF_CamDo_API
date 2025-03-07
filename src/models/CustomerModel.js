const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone')

const Customer = new Schema({
    username: { type: String, required: true },
    password: {type: String, required: true},
    customerInfo: { type: Object, required: true },
    deviceId: { type: String, default: "" },
    firebaseToken: { type: String, default: "" },
    isDelete: {type: Boolean, default: false},
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

Customer.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    const now = moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format();
    this.set({ updatedAt: now }); // Cập nhật trường updatedAt với thời gian hiện tại ở múi giờ Việt Nam
    next();
});

module.exports = mongoose.model('customer', Customer)