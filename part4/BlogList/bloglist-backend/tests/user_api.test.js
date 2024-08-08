const { test, after, beforeEach, describe } = require('node:test')
let mongoose = require('mongoose')
const assert = require('assert')
const app = require('../app')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)


describe('invalid user add tests', () => {

  beforeEach(async () => {
    await User.deleteMany({})

    const defaultUser = new User({
      username: 'root',
      name: 'SuperUser',
      password: 'astrongpassword'
    })

    await defaultUser.save()
  })
  test('user with too short a user name', async () => {
    const usersAtStart = await helper.getUsersInDb()

    const newUser = {
      username: 'ts',
      name: 'Short username',
      password: 'a strong password'
    }

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('username too short'))
    const usersAtEnd = await helper.getUsersInDb()
    assert.strictEqual(usersAtStart.length, usersAtEnd.length)
  })

  test('user with too short a password', async () => {
    const usersAtStart = await helper.getUsersInDb()

    const newUser = {
      username: 'temp username',
      name: 'temp username',
      password: '12'
    }

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('password too short'))
    const usersAtEnd = await helper.getUsersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('user with existing username', async () => {
    const usersAtStart = await helper.getUsersInDb()

    const newUser = {
      username: 'root',
      name: 'temp username',
      password: 'astrongpassword'
    }

    const response = await api.post('/api/users')
      .send(newUser)
      .expect(400)

    assert(response.body.error.includes('username expected to be unique'))
    const usersAtEnd = await helper.getUsersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

})

after(async () => {
  mongoose.connection.close()
})
