const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const FollowSchema = new Schema(
  {
    userId: { type: ObjectId, required: true },
    followId: { type: ObjectId, required: true }
  },
  {
    versionKey: false
  }
)
FollowSchema.index({ userId: 1, followId: 1 }, { unique: true })

exports.Follow = mongoose.model('Follow', FollowSchema)

exports.validateObjectId = idString => {
  return ObjectId.isValid(idString)
}
