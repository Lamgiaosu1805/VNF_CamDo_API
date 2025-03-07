const redis = require("../config/connectRedis")
const CustomerModel = require("../models/CustomerModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")

const AuthController = {
    validatePhoneNumber: async (req, res) => {
        const {body} = req
        try {
            const customer = await CustomerModel.findOne({username: body.phoneNumber})
            if(body.phoneNumber?.toString().length != 10) {
                res.json(FailureResponse("02"))
                return
            }
            res.json(SuccessResponse({
                isCustomer: customer ? true : false
            }))
        } catch (error) {
            console.log(error)
            FailureResponse("01", error)
        }
    },
    validateLogin: async (req, res) => { 
        try {
            const { username } = req.body;
            const { deviceId } = req
            const customer = await CustomerModel.findOne({ username });
            if (!customer) {
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            }
            if (customer.deviceId === deviceId) {
                return res.json({ message: "Đăng nhập thành công, không cần OTP" });
            }
            const otp = "000000";
            const key = `otp:${username}:login`;

            await redis.set(key, otp, "EX", 60); // Lưu OTP vào Redis, hết hạn sau 60 giây

            res.json({ message: "OTP đã được gửi", otp }); // Trong thực tế, bạn sẽ gửi OTP qua email/SMS
        } catch (error) {
            console.log(error)
        }
    },
    validateOTP: async (req, res) => {
        try {
            const { username, otp } = req.body;
            const { deviceId } = req
            const key = `otp:${username}:login`;
            const storedOtp = await redis.get(key);
            console.log(storedOtp)
            if (!storedOtp) {
                return res.status(400).json({ message: "OTP không hợp lệ hoặc đã hết hạn" });
            }
        
            if (storedOtp !== otp) {
                return res.status(400).json({ message: "OTP không chính xác" });
            }
            await redis.del(key); // Xóa OTP sau khi xác minh thành công

            // Cập nhật deviceId mới trong MongoDB
            console.log(deviceId)
            await CustomerModel.updateOne({ username }, { deviceId: deviceId });
          
            res.json({ message: "Xác thực OTP thành công! Device ID đã được cập nhật." });
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = AuthController