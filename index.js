const express = require('express')
const app = express()
const route = require('./src/routes')
const morgan = require('morgan')
const db = require('./src/config/connectdb')
const cors = require('cors');

require('dotenv').config();

//use middlewares
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({
    extended: true
}))

db.connect();

app.use(cors());
app.use("/uploads", express.static("/var/www/X_finance_upload"));

//routing
route(app);

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`X-FINANCE listening on port ${port}`)
})
