const mongoose = require('mongoose')

const User = require('../../models/user.js').User
const Follow = require('../../models/follow.js').Follow
const ObjectId = mongoose.Types.ObjectId

const user1Id = new ObjectId('000000000000000000000000')
const user2Id = new ObjectId('000000000000000000000001')
const user3Id = new ObjectId('000000000000000000000002')

const users = [
  {
    _id: user1Id,
    name: 'alice',
    avatarUrl: 'https://example.com/dummy1'
  },
  {
    _id: user2Id,
    name: 'bob',
    avatarUrl: 'https://example.com/dummy2'
  },
  {
    _id: user3Id,
    name: 'carol',
    avatarUrl: 'https://example.com/dummy3'
  }
]
const follows = [
  {
    userId: user1Id,
    followId: user2Id
  },
  {
    userId: user1Id,
    followId: user3Id
  },
  {
    userId: user2Id,
    followId: user1Id
  }
]

module.exports = {
  createData: async () => {
    await User.insertMany(users)
    await Follow.insertMany(follows)
  },

  deleteData: async () => {
    await User.deleteMany().exec()
    await Follow.deleteMany().exec()
  },
  users: users
}
