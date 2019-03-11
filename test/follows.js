const test = require('ava')
const supertest = require('supertest')
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const { MongoMemoryServer } = require('mongodb-memory-server')

console.error = () => {}
const generator = require('./helpers/generator.js')
const router = require('../controllers/v1/follows.js')
const model = require('../models/follow.js')
const Follow = model.Follow

const user1Id = generator.users[0]._id.toString()
const user2Id = generator.users[1]._id.toString()
const user3Id = generator.users[2]._id.toString()

const mongod = new MongoMemoryServer()
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/users/:id/follows', router)

test.before(async () => {
  const uri = await mongod.getConnectionString()
  mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true })
})

test.beforeEach(async () => {
  await generator.createData()
})

test.afterEach.always(async () => {
  await generator.deleteData()
})

// GET /users/:id/follows
test.serial('get follows', async t => {
  const res = await supertest(app).get(`/users/${user1Id}/follows`)
  t.is(res.status, 200)
  t.is(res.body.length, 2)
})

test.serial('get follows not found', async t => {
  const res = await supertest(app).get(
    `/users/999999999999999999999999/follows`
  )
  t.is(res.status, 200)
  t.is(res.body.length, 0)
})

test.serial('get follows invalid id', async t => {
  const res = await supertest(app).get(`/users/invalid/follows`)
  t.is(res.status, 400)
  t.deepEqual(res.body, { error: 'BadRequest' })
})

// POST /users/:id/follows
test.serial('create follow', async t => {
  const res = await supertest(app)
    .post(`/users/${user2Id}/follows`)
    .send({ followId: user3Id })
  t.is(res.status, 200)
  const follows = await Follow.find({ userId: user2Id }).exec()
  t.is(follows.length, 2)
})

test.serial('create follow no followId', async t => {
  const res = await supertest(app)
    .post(`/users/${user2Id}/follows`)
    .send({})
  t.is(res.status, 400)
  t.deepEqual(res.body, { error: 'BadRequest' })
})

// DELETE /users/:id/follows
test.serial('delete follow', async t => {
  const res = await supertest(app)
    .delete(`/users/${user1Id}/follows`)
    .query({ followId: user2Id })
  t.is(res.status, 200)
  const follows = await Follow.find({ userId: user1Id }).exec()
  t.is(follows.length, 1)
})

test.serial('delete follow not found', async t => {
  const res = await supertest(app)
    .delete(`/users/${user3Id}/follows`)
    .query({ followId: user2Id })
  t.is(res.status, 404)
  t.deepEqual(res.body, { error: 'NotFound' })
})
