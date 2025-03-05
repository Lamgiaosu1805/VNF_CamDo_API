const express = require('express')
const app = express()
const route = require('./src/routes')
const morgan = require('morgan')
const db = require('./src/config/connectdb')

require('dotenv').config();

//use middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

db.connect();

//routing
route(app);

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`X-FINANCE listening on port ${port}`)
})
