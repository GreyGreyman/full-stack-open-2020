const supertest = require('supertest')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')
const jwt = require('jsonwebtoken')

const api = supertest(app)

let testToken = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const user = new User({
    username: 'test',
    passwordHash: 'pest'
  })

  const testUser = await user.save()
  testToken = jwt.sign({ username: testUser.username, id: user._id }, process.env.SECRET)

  const initialBlogs = helper.initialBlogs.map(blog => ({ ...blog, user: testUser._id }))

  for (const blog of initialBlogs) {
    const blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('GET', () => {
  test('blogs return as a json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('specific blog is returned', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    expect(titles).toContain('Go To Statement Considered Harmful')
  })

  test('id not _id', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).not.toHaveProperty('_id')
  })
})

describe('POST', () => {
  test('valid blog can be added', async () => {
    const newBlog = {
      title: 'test',
      author: 'pest',
      url: 'testurl',
      likes: 42,
    }
    let response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
    expect(response.body).toMatchObject(newBlog)

    const blogsInDB = await helper.blogsInDB()
    expect(blogsInDB).toHaveLength(helper.initialBlogs.length + 1)
    expect(blogsInDB).toContainEqual(expect.objectContaining(newBlog))
  })

  test('add likes = 0 if missing', async () => {
    const newBlog = {
      title: 'test',
      author: 'pest',
      url: 'testurl',
    }

    const expectedBlog = { ...newBlog, likes: 0 }

    let response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)
      .expect(201)

    expect(response.body).toMatchObject(expectedBlog)

    const blogsInDB = await helper.blogsInDB()
    expect(blogsInDB).toContainEqual(expect.objectContaining(newBlog))
  })

  test('cant create without title', async () => {
    const newBlog = {
      author: 'pest',
      url: 'test_url',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)
      .expect(400)
  })

  test('cant create without url', async () => {
    const newBlog = {
      author: 'pest',
      title: 'test_title',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${testToken}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: 'test',
      author: 'pest',
      url: 'testurl',
      likes: 42,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('GET /id', () => {
  test('succeed with a valid id and found', async () => {
    let specificBlog = await Blog.findOne({}).populate('user', { username: 1, name: 1, id: 1 })
    specificBlog = specificBlog.toJSON()

    const returnedBlog = await api
      .get(`/api/blogs/${specificBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(returnedBlog.body).toEqual(specificBlog)
  })

  test('fail with 404 if not found', async () => {
    await api
      .get(`/api/blogs/${await helper.nonExistingId()}`)
      .expect(404)
  })

  test('fail with 400 if invalid id', async () => {
    await api
      .get('/api/blogs/invalidID')
      .expect(400)
  })
})

describe('PUT', () => {
  test('succeed with 200 if valid and found', async () => {

    const blog = await Blog.findOne({})
    blog.likes += 1
    const modifiedBlog = blog.toJSON()
    modifiedBlog.user = modifiedBlog.user.toString()

    const response = await api
      .put(`/api/blogs/${modifiedBlog.id}`)
      .send(modifiedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toEqual(modifiedBlog)
  })

  test('fail with 400 if data is invalid', async () => {
    const blogsInDB = await helper.blogsInDB()
    let modifiedBlog = blogsInDB[0]
    modifiedBlog.likes += 1

    delete modifiedBlog.title

    await api
      .put(`/api/blogs/${modifiedBlog.id}`)
      .send(modifiedBlog)
      .expect(400)
  })

  test('fail with 404 if not found', async () => {
    const blogs = await helper.blogsInDB()
    let modifiedBlog = blogs[0]
    modifiedBlog.likes += 1

    await api
      .put(`/api/blogs/${await helper.nonExistingId()}`)
      .send(modifiedBlog)
      .expect(404)
  })

  test('fail with 400 if invalid id', async () => {
    const blogs = await helper.blogsInDB()
    let modifiedBlog = blogs[0]
    modifiedBlog.likes += 1

    await api
      .put('/api/blogs/invalidID')
      .send(modifiedBlog)
      .expect(400)
  })
})


describe('DELETE', () => {
  test('succeed with 204 if id is valid', async () => {
    const blogsBefore = await helper.blogsInDB()
    const blogToDelete = blogsBefore[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${testToken}`)
      .expect(204)

    const blogsAfter = await helper.blogsInDB()
    expect(blogsAfter).toHaveLength(blogsBefore.length - 1)
    expect(blogsAfter).not.toContainEqual(expect.objectContaining(blogToDelete))
  })

  test('fail with 400 if invalid id', async () => {
    const blogsBefore = await helper.blogsInDB()
    await api
      .delete('/api/blogs/invalidID')
      .set('Authorization', `bearer ${testToken}`)
      .expect(400)

    const blogsAfter = await helper.blogsInDB()
    expect(blogsAfter).toHaveLength(blogsBefore.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})