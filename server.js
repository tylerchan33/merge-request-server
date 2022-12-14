// require packages
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const rowdy = require('rowdy-logger')
const authLockedRoute = require("./controllers/api-v1/authLockedRoute")

// config express app
const app = express()
const PORT = process.env.PORT || 3001 
// for debug logging 
const rowdyResults = rowdy.begin(app)
// cross origin resource sharing 
app.use(cors())
// request body parsing
app.use(express.urlencoded({ limit: '50mb' ,extended: true })) // optional 
app.use(express.json({ limit: '50mb' } ))


// GET / -- test index route
app.get('/', (req, res) => {
  res.json({ msg: 'hello backend 🤖' })
})

// controllers
app.use('/api-v1/users', require('./controllers/api-v1/users.js'))
app.use('/api-v1/messages', require('./controllers/api-v1/messages.js'))
app.use('/api-v1/photos', require('./controllers/api-v1/photos.js'))
app.use('/api-v1/api', require('./controllers/api-v1/api.js'))

// hey listen
app.listen(PORT, () => {
  rowdyResults.print()
  console.log(`is that port ${PORT} I hear? 🙉`)
})

