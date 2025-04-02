const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone')

const BankInfo = new Schema({
    bank_citad_code: { type: String },
    bank_code: { type: String },
    bank_id: { type: String },
    bank_name: { type: String },
    bank_short_name: { type: String },
    details: { type: String },
    regex: { type: String },
    sml_code: { type: String },
    icon: { type: String },
    baseUrl: { type: String },
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

BankInfo.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    const now = moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format();
    this.set({ updatedAt: now }); // Cập nhật trường updatedAt với thời gian hiện tại ở múi giờ Việt Nam
    next();
});

module.exports = mongoose.model('bankInfo', BankInfo)