const jwt = require('jsonwebtoken')
const { FailureResponse } = require('../utils/ResponseRequest')
const AdminAccountModel = require('../models/AdminAccountModel')
const CustomerModel = require('../models/CustomerModel')

const auth = {
    verifyTokenAdmin: (req, res, next) => {
        verifyToken(true, req, res, next)
    },
    verifyTokenCustomer: (req, res, next) => {
        verifyToken(false, req, res, next)
    }
}

const verifyToken = (isAdmin, req, res, next) => {
    const token = req.headers.authorization;
    if(token) {
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, isAdmin == true ? process.env.SECRET_KEY_QT : process.env.SECRET_KEY, async (err, user) => {
            if(err) {
                console.log(err)
                res.json(FailureResponse('20', err))
            }
            else {
                req.user = user;
                try {
                    var validatedUser
                    isAdmin == true ? validatedUser = await AdminAccountModel.findById(user.id) : validatedUser = await CustomerModel.findById(user.id)
                    if(!validatedUser?.isDelete) {
                        next();
                    }
                    else {
                        res.json(FailureResponse("04"))
                    }
                } catch (error) {
                    console.log(error)
                    res.json(FailureResponse("21", error))
                }
            }
        })
    } else {
        res.json(FailureResponse('22'))
        console.log("Not Authenticated")
    }
}

module.exports = auth