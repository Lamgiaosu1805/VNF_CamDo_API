const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone')

const LoaiTaiSanTheChap = new Schema({
    ten: { type: String, required: true },
    type: { type: Number, required: true },
    ghiChu: { type: String, default: "" },
    imageUrl: { type: String, required: true },
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

LoaiTaiSanTheChap.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    const now = moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format();
    this.set({ updatedAt: now }); // Cập nhật trường updatedAt với thời gian hiện tại ở múi giờ Việt Nam
    next();
});

module.exports = mongoose.model('loaiTaiSanTheChap', LoaiTaiSanTheChap)