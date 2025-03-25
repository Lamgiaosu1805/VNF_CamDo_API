const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone')

const HopDong = new Schema({
    soHopDong: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    linkHopDong: { type: String, required: true },
    trangThai: { type: Number, default: 1 }, // 1: Đã ký
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

HopDong.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    const now = moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format();
    this.set({ updatedAt: now }); // Cập nhật trường updatedAt với thời gian hiện tại ở múi giờ Việt Nam
    next();
});

module.exports = mongoose.model('hopDong', HopDong)