// require mongoose ODM
const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  to: {
    type: String
  },
  from: {
    type: String
  },
  content: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Message', MessageSchema)