const authRouter = require('./auth')
const taiSanRouter = require('./taiSan')
const yeuCauVayVonRouter = require('./yeuCauVay')
const customerRouter = require('./customer')
const notificationRouter = require('./notification')

const route = (app) => {
    app.use(`/auth`, authRouter)
    app.use(`/taiSan`, taiSanRouter)
    app.use(`/yeuCauVayVon`, yeuCauVayVonRouter)
    app.use(`/customer`, customerRouter)
    app.use(`/notification`, notificationRouter)
}

module.exports = route;