
const validateDevice = require('../middlewares/validateDeviceId');
const authRouter = require('./auth')

const route = (app) => {
    app.use(`/auth`, validateDevice.checkNullDeviceId, authRouter)
}

module.exports = route;