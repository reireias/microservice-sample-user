const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    avatarUrl: { type: String }
  },
  {
    versionKey: false
  }
)

exports.User = mongoose.model('User', UserSchema)
