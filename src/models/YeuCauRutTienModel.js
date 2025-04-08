const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone')

const YeuCauRutTien = new Schema({
    customerId: { type: String, required: true },
    hoTenCustomer: { type: String, required: true },
    soTienRut: { type: Number, required: true },
    idTKLK: { type: String, required: true },
    status: { type: Number, required: true, default: 1 },// 1: đang chờ phê duyệt, 2: Đã phê duyệt, 3: Đã từ chối
    idNguoiPheDuyet: {type: String, default: ""},
    lyDoTuChoi: { type: String },
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

YeuCauRutTien.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    const now = moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format();
    this.set({ updatedAt: now }); // Cập nhật trường updatedAt với thời gian hiện tại ở múi giờ Việt Nam
    next();
});

module.exports = mongoose.model('yeuCauRutTien', YeuCauRutTien)