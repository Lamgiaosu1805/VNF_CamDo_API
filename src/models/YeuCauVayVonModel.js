const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone')

const YeuCauVayVon = new Schema({
    customerId: { type: String, required: true },
    idLoaiTaiSan: { type: String, required: true },
    nhanHieu: { type: String },
    tenTaiSan: { type: String },
    ghiChu: { type: String },
    status: { type: Number, required: true, default: 1 }, //1. Chờ tư vấn, 2. Đã chăm sóc, 3. Đã giải ngân, 4. Huỷ
    lyDoHuy: { type: String, default: "" },
    isDelete: { type: Boolean, default: false },
    listAnhTaiSan: { type: Array, required: true },
    namSX: { type: String, default: "" },
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

YeuCauVayVon.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    const now = moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format();
    this.set({ updatedAt: now }); // Cập nhật trường updatedAt với thời gian hiện tại ở múi giờ Việt Nam
    next();
});

module.exports = mongoose.model('yeuCauVayVon', YeuCauVayVon)