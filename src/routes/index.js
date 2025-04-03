const authRouter = require('./auth')
const taiSanRouter = require('./taiSan')
const yeuCauVayVonRouter = require('./yeuCauVay')
const customerRouter = require('./customer')
const notificationRouter = require('./notification')
const hopDongRouter = require('./hopDong')
const khoanVayRouter = require('./khoanVay')
const transactionRouter = require('./transaction')

const route = (app) => {
    app.use(`/auth`, authRouter)
    app.use(`/taiSan`, taiSanRouter)
    app.use(`/yeuCauVayVon`, yeuCauVayVonRouter)
    app.use(`/customer`, customerRouter)
    app.use(`/notification`, notificationRouter)
    app.use(`/hopDong`, hopDongRouter)
    app.use(`/khoanVay`, khoanVayRouter)
    app.use(`/transaction`, transactionRouter)
}

module.exports = route;