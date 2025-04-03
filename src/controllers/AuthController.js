const redis = require("../config/connectRedis")
const AdminAccountModel = require("../models/AdminAccountModel")
const CustomerModel = require("../models/CustomerModel")
const { FailureResponse, SuccessResponse } = require("../utils/ResponseRequest")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const AuthController = {
    validatePhoneNumber: async (req, res) => {
        try {
            const {body, deviceId} = req
            const customer = await CustomerModel.findOne({username: body.phoneNumber})
            if(body.phoneNumber?.toString().length != 10) {
                return res.json(FailureResponse("02"))
            }
            if(customer) {
                return res.json(SuccessResponse({
                    isCustomer: true,
                    message: ""
                }))
            }
            const otp = "000000";
            const key = `otp:${body.phoneNumber}:signUp:${deviceId}`;
            const time_expr = 60
            await redis.set(key, otp, "EX", time_expr); // Lưu OTP vào Redis, hết hạn sau 60 giây
            res.json(SuccessResponse({
                isCustomer: false,
                exprTime: time_expr,
                message: "Tài khoản chưa tồn tại, OTP đã được gửi",
            }));
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("01", error))
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
            res.json(FailureResponse("05", error))
        }
    },
    validateOTP: async (req, res) => {
        try {
            const { username, otp, type } = req.body;
            const { deviceId } = req
            const key = `otp:${username}:${type}:${deviceId}`;
            const storedOtp = await redis.get(key);
            const keyForgotPass = `${username}:forgotPasswordValidate`

            if (!storedOtp) {
                return res.json(FailureResponse("07"));
            }
        
            if (storedOtp !== otp) {
                return res.json(FailureResponse("08"));
            }
            
            if(type == "login") {
                await CustomerModel.updateOne({ username }, { deviceId });
            }
            else if(type == "forgotPassword") {
                await redis.set(keyForgotPass, "validated", "EX", 3600)
                await CustomerModel.updateOne({ username }, { deviceId });
            }
            else if(type == "signUp") {
                await redis.set(`${username}:validateDevice`, deviceId, "EX", 3600) // Key check Đúng device yêu cầu OTP để tạo tài khoản
            }
            else if(type == "addTKNH") { //KEY OTP ADD Tài khoản ngân hàng
                await redis.set(`${username}:addTKNH`, otp, "EX", 3600) // Key check Đúng device yêu cầu OTP để tạo tài khoản
            }
            else {
                console.log(`${type}: type không xác định`)
                return res.json(FailureResponse("07"))
            }
            res.json(SuccessResponse({ 
                message: "Xác thực OTP thành công!.",
                typeOTP: type
            }));
            await redis.del(key); // Xóa OTP sau khi xác minh thành công
            
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("06", error))
        }
    },
    login: async (req, res) => {
        try {
            const {body, customer} = req
            const validPassWord = await bcrypt.compare(
                body.password,
                customer.password
            )
            if(!validPassWord) {
                return res.json(FailureResponse("13"))
            }
            const accessToken = genAccessToken(customer, "")
            res.json(SuccessResponse({
                message: "Đăng nhập thành công",
                accessToken
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("14", error))
        }
    },
    signUp: async (req, res) => {
        try {
            const {body} = req
            const key = `${body.username}:validateDevice`
            const value = await redis.get(key);
            if(value == req.deviceId) {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(body.password, salt)
                const newCustomer = new CustomerModel({
                    username: body.username,
                    password: hashedPassword,
                    deviceId: req.deviceId
                })
                const customer = await newCustomer.save()
                const accessToken = genAccessToken(customer, "")
                await redis.del(key)
                return res.json(SuccessResponse({
                    message: "Thêm mới tài khoản thành công",
                    accessToken
                }))
            }
            res.json(FailureResponse("11"))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("12", error))
        }
    },
    createAccountAdmin: async (req, res) => {
        try {
            const {body} = req
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(body.password, salt)
            const newAdminAccount = new AdminAccountModel({
                username: body.username,
                password: hashedPassword
            })
            await newAdminAccount.save()
            res.json(SuccessResponse({
                message: "Tạo tài khoản admin thành công"
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("15", error))
        }
    },
    loginAdmin: async (req, res) => {
        try {
            const {body} = req
            const adminAcc = await AdminAccountModel.findOne({username: body.username})
            if(!adminAcc) {
                return res.json(FailureResponse("04"))
            }
            const validPassWord = await bcrypt.compare(
                body.password,
                adminAcc.password
            )
            if(!validPassWord) {
                return res.json(FailureResponse("13"))
            }
            const accessToken = genAccessToken(adminAcc, "admin")
            res.json(SuccessResponse({
                message: "Đăng nhập thành công",
                accessToken
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("15", error))
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const {body, deviceId} = req
            const customer = await CustomerModel.findOne({username: body.username})
            if(!customer) {
                return res.json(FailureResponse("04"))
            }
            const otp = "000000";
            const key = `otp:${body.username}:forgotPassword:${deviceId}`;
            const time_expr = 60
            await redis.set(key, otp, "EX", time_expr); // Lưu OTP vào Redis, hết hạn sau 60 giây
            console.log(key)
            res.json(SuccessResponse({
                message: "Đã gửi OTP",
                exprTime: time_expr
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("17"))
        }
    },
    resetPassword: async (req, res) => {
        try {
            const {body, customer} = req
            const keyForgotPass = `${body.username}:forgotPasswordValidate`
            const otpValidateStatus = await redis.get(keyForgotPass)
            if(otpValidateStatus != "validated") {
                console.log("Yêu cầu Validate OTP trước")
                return res.json(FailureResponse("11"))
            }
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(body.password, salt)
            const accessToken = genAccessToken(customer, "")
            await CustomerModel.updateOne({username: body.username}, {password: hashedPassword})
            await redis.del(keyForgotPass)
            res.json(SuccessResponse({
                message: "Cập nhật mật khẩu thành công",
                accessToken: accessToken
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("18", error))
        }
    },
    genOTP: async (req, res) => {
        try {
            const {typeOTP} = req.body
            const OTP = "000000"
            const key = `otp:${req.user.username}:${typeOTP}:${req.deviceId}`;
            const time_expr = 60
            await redis.set(key, OTP, "EX", time_expr)
            res.json(SuccessResponse({
                message: "OTP đã được gửi",
                exprTime: time_expr
            }))
        } catch (error) {
            console.log(error)
            res.json(FailureResponse("52", error))
        }
    }
}

const genAccessToken = (account, type) => {
    return jwt.sign({
        id: account._id,
        username: account.username,
    },
        type == "admin" ? process.env.SECRET_KEY_QT : process.env.SECRET_KEY,
        {
            expiresIn: "365d"
        }
    )
}

module.exports = AuthController