
const validateDeviceId = require('../middlewares/validateDeviceId');
const authRouter = require('./auth')

const route = (app) => {
    app.use(`/auth`, validateDeviceId, authRouter)
}

module.exports = route;