const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
app.use(morgan('short'))

// database
const dbUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017/user'
const options = { useNewUrlParser: true }
if (process.env.MONGODB_ADMIN_NAME) {
  options.user = process.env.MONGODB_ADMIN_NAME
  options.pass = process.env.MONGODB_ADMIN_PASS
  options.auth = { authSource: 'admin' }
}
mongoose.connect(dbUrl, options)

// server
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('./controllers'))

app.listen(process.env.PORT || 3000, () => {})
