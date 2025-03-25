const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone')

const KyVay = new Schema({
    soHopDong: { type: String, required: true },
    customerId: { type: String, required: true },
    ky: { type: Number, required: true },
    ngayTraNo: { type: String, required: true },
    soTienCanTra: { type: Number, required: true },
    soTienDaTra: { type: Number, default: 0 },
    trangThai: { type: Number, default: 1 }, //1: Chưa thanh toán, 2: Đã thanh toán, 3: Trễ hạn
    lichSuTra: { type: Array, default: [] },
    laiQuaHan: { type: Number, default: 0 },
    phiPhat: { type: Number, default: 0 }, 
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

KyVay.pre(['updateOne', 'findOneAndUpdate'], function(next) {
    const now = moment.tz(Date.now(), 'Asia/Ho_Chi_Minh').format();
    this.set({ updatedAt: now }); // Cập nhật trường updatedAt với thời gian hiện tại ở múi giờ Việt Nam
    next();
});

module.exports = mongoose.model('kyVay', KyVay)