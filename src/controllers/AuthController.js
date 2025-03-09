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
                isCustomer: customer ? true : false,
                message: customer ? "" : "Chưa có tài khoản, vui lòng đăng ký"
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
                return res.json(FailureResponse("04"));
            }
            if (customer.deviceId === deviceId) {
                return res.json(SuccessResponse({
                    type: 1,
                    message: "Trùng device Id, Đăng nhập không cần OTP"
                }));
            }
            const otp = "000000";
            const key = `otp:${username}:login:${deviceId}`;
            const time_expr = 60
            await redis.set(key, otp, "EX", time_expr); // Lưu OTP vào Redis, hết hạn sau 60 giây

            res.json(SuccessResponse({
                exprTime: time_expr,
                message: "Không trùng deviceId, OTP đã được gửi",
                type: 2
            }));
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("05"))
        }
    },
    validateOTP: async (req, res) => {
        try {
            const { username, otp } = req.body;
            const { deviceId } = req
            const key = `otp:${username}:login:${deviceId}`;
            const storedOtp = await redis.get(key);

            if (!storedOtp) {
                return res.json(FailureResponse("07"));
            }
        
            if (storedOtp !== otp) {
                return res.json(FailureResponse("08"));
            }
            await redis.del(key); // Xóa OTP sau khi xác minh thành công

            await CustomerModel.updateOne({ username }, { deviceId: deviceId });
          
            res.json(SuccessResponse({ message: "Xác thực OTP thành công! Device ID đã được cập nhật." }));
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("06"))
        }
    }
}

module.exports = AuthController