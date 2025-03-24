const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment-timezone')

const YeuCauVayVon = new Schema({
    customerId: { type: String, required: true },
    maYeuCau: { type: String, required: true, unique: true },
    idLoaiTaiSan: { type: String, required: true, ref: "loaiTaiSanTheChap" },
    nhanHieu: { type: String },
    tenTaiSan: { type: String },
    ghiChu: { type: String },
    status: { type: Number, required: true, default: 1 }, //1. Chờ tư vấn, 2. Đã thẩm định, 3. Đã phê duyệt chờ giải ngân, 4. Đã giải ngân, 5. Huỷ, 6. Đã đồng ý giải ngân - Chờ khách hàng ký
    lyDoHuy: { type: String, default: "" },
    isDelete: { type: Boolean, default: false },
    listAnhTaiSan: { type: Array, required: true },
    namSX: { type: String, default: "" },
    idNguoiPheDuyet: { type: String, default: "" },
    idNguoiGiaiNgan: { type: String, default: "" },
    idNguoiThamDinh: { type: String, default: "" },
    giaTriSauThamDinh: { type: Number, default: 0 },
    donViGia: { type: String, default: "VNĐ" },
    soKyTraNo: { type: Number, default: 0 },
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