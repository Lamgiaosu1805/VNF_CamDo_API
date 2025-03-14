const authRouter = require('./auth')
const taiSanRouter = require('./taiSan')

const route = (app) => {
    app.use(`/auth`, authRouter)
    app.use(`/taiSan`, taiSanRouter)
}

module.exports = route;