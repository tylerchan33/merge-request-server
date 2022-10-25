// require mongoose ODM
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  birthDay: {
    type: Number
  },
  birthMonth: {
    type: Number
  },
  birthYear: {
    type: Number
  },
  gender: {
    type: String
  },
  city: {
    type: String
  },
  lookingFor: {
    type: String
  },
  likedUsers: {
    type: Array
  },
  matchedUsers: {
    type: Array
  },
  photos: {
    type: Array
  },
  biography: {
    type: String
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', UserSchema)