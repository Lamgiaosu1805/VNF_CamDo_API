const authRouter = require('./auth')
const taiSanRouter = require('./taiSan')
const yeuCauVayVonRouter = require('./yeuCauVay')
const customer = require('./customer')

const route = (app) => {
    app.use(`/auth`, authRouter)
    app.use(`/taiSan`, taiSanRouter)
    app.use(`/yeuCauVayVon`, yeuCauVayVonRouter)
    app.use(`/customer`, customer)
}

module.exports = route;