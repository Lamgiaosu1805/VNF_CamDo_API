const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone')

const KhoanVay = new Schema({
    soHopDong: { type: String, required: true, unique: true },
    customerId: { type: String, required: true },
    maYeuCau: { type: String, required: true },
    chiTietKhoanVay: {type: Object, required: true}, // Bao gồm các loại phí, tổng số tiền, lãi xuất ...
    status: {type: Boolean, default: false}, //Trạng thái true: Đã thanh toán, false: Đang hoạt động
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

KhoanVay.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    const now = moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format();
    this.set({ updatedAt: now }); // Cập nhật trường updatedAt với thời gian hiện tại ở múi giờ Việt Nam
    next();
});

module.exports = mongoose.model('khoanVay', KhoanVay)