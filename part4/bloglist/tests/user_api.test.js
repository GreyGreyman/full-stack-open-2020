const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany()

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'pest',
      password: 'testpest',
    }

    const response = await api
      .post('/api/users/')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    delete newUser.password
    expect(response.body).toMatchObject(newUser)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length + 1)

    const usernames = usersAfter.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'superuser',
      password: 'root',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('creation fails with 400 and error message if username is omitted', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      name: 'pest',
      password: 'testpest',
    }

    const response = await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('`username` is required')

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('creation fails with 400 and error message if username is shorter than required', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      username: 't',
      name: 'pest',
      password: 'testpest',
    }

    const response = await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('is shorter than the minimum allowed length')

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('creation fails with 400 and error message if password is omitted', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'pest',
    }

    const response = await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('password is required')

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('creation fails with 400 and error message if password is shorter than required', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'pest',
      password: 't',
    }

    const response = await api
      .post('/api/users/')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('is shorter than the minimum allowed length')

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})