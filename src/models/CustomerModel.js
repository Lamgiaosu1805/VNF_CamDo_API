const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone')

const Customer = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String },
    birth: { type: String },
    anhChanDung: { type: String },
    cccd: { type: String },
    cccdFrontImg: {type: String},
    cccdBackImg: {type: String},
    diaChiThuongTru: {type: String},
    diaChiHienTai: {type: String},
    deviceId: { type: String, default: "" },
    gioiTinh: {type: String},
    ngayCap: {type: String},
    noiCap: {type: String},
    ngayHetHan: {type: String},
    firebaseToken: { type: String, default: "" },
    isDelete: { type: Boolean, default: false },
    soDuKhaDung: { type: Number, default: 0 },
    createdAt: {
        type: String,
        default: () => moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format(), // Tự động lưu với múi giờ +7
    },
    updatedAt: {
        type: String,
        default: () => moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format(), // Tự động lưu với múi giờ +7
    },
    isEkyc: {type: Boolean, default: false},
}, {
    timestamps: false
})

Customer.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    const now = moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format();
    this.set({ updatedAt: now }); // Cập nhật trường updatedAt với thời gian hiện tại ở múi giờ Việt Nam
    next();
});

module.exports = mongoose.model('customer', Customer)