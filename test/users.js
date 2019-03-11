const test = require('ava')
const supertest = require('supertest')
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const { MongoMemoryServer } = require('mongodb-memory-server')

console.error = () => {}
const generator = require('./helpers/generator.js')
const router = require('../controllers/v1/users.js')
const model = require('../models/user.js')
const User = model.User
const users = generator.users

const mongod = new MongoMemoryServer()
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/users', router)

test.before(async () => {
  const uri = await mongod.getConnectionString()
  mongoose.connect(uri, { useNewUrlParser: true })
})

test.beforeEach(async () => {
  await generator.createData()
})

test.afterEach.always(async () => {
  await generator.deleteData()
})

// GET /users
test.serial('get users', async t => {
  const res = await supertest(app).get('/users')
  t.is(res.status, 200)
  t.is(res.body.length, 3)
})

// GET /users/:id
test.serial('get user', async t => {
  const userId = users[0]._id.toString()
  const res = await supertest(app).get(`/users/${userId}`)
  t.is(res.status, 200)
  t.is(res.body._id, userId)
  t.is(res.body.name, users[0].name)
})

test.serial('get user not found', async t => {
  const res = await supertest(app).get(
    `/users/${new mongoose.Types.ObjectId()}`
  )
  t.is(res.status, 404)
  t.deepEqual(res.body, { error: 'NotFound' })
})

test.serial('get user id is invalid', async t => {
  const res = await supertest(app).get('/users/invalid')
  t.is(res.status, 400)
  t.deepEqual(res.body, { error: 'BadRequest' })
})

// POST /users
test.serial('create user', async t => {
  const name = 'dave'
  const res = await supertest(app)
    .post('/users')
    .send({ name: name })
  t.is(res.status, 200)
  t.true('_id' in res.body)
  t.is(res.body.name, name)
})

test.serial('create user name is empty', async t => {
  const res = await supertest(app)
    .post('/users')
    .send({})
  t.is(res.status, 400)
  t.deepEqual(res.body, { error: 'BadRequest' })
})

// PUT /users/:id
test.serial('update user', async t => {
  const name = 'new name'
  const res = await supertest(app)
    .put(`/users/${users[0]._id}`)
    .send({ name: name })
  t.is(res.status, 200)
  t.is(res.body.name, name)
})

test.serial('put user not found', async t => {
  const res = await supertest(app).put(
    `/users/${new mongoose.Types.ObjectId()}`
  )
  t.is(res.status, 404)
  t.deepEqual(res.body, { error: 'NotFound' })
})

test.serial('put user id is invalid', async t => {
  const res = await supertest(app).put('/users/invalid')
  t.is(res.status, 400)
  t.deepEqual(res.body, { error: 'BadRequest' })
})

// DELETE /users/:id
test.serial('delete user', async t => {
  const res = await supertest(app).delete(`/users/${users[0]._id}`)
  t.is(res.status, 200)
  const actual = await User.find()
  t.is(actual.length, 2)
})

test.serial('delete user not found', async t => {
  const res = await supertest(app).delete(
    `/users/${new mongoose.Types.ObjectId()}`
  )
  t.is(res.status, 404)
  t.deepEqual(res.body, { error: 'NotFound' })
})

test.serial('delete user id is invalid', async t => {
  const res = await supertest(app).delete('/users/invalid')
  t.is(res.status, 400)
  t.deepEqual(res.body, { error: 'BadRequest' })
})
