const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
  response.json(blogs)
})


blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body
  const token = jwt.verify(request.token, process.env.SECRET)

  const user = await User.findById(token.id)
  const blog = new Blog({
    url,
    title,
    author,
    likes: likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  await savedBlog.populate('user', { username: 1, name: 1, id: 1 }).execPopulate()
  response.status(201).json(savedBlog)
})


blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1, id: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


blogsRouter.put('/:id', async (request, response) => {

  const updatedBlog =
    await Blog.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
      .populate('user', { username: 1, name: 1, id: 1 })

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})


blogsRouter.delete('/:id', async (request, response) => {
  const token = jwt.verify(request.token, process.env.SECRET)

  const user = await User.findById(token.id)
  const blog = await Blog.findById(request.params.id)
  if (user.id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: 'unauthorized deletion' })
  }

  await Blog.findByIdAndDelete(request.params.id)

  user.blogs = user.blogs.filter(b => b.id.toString() !== request.params.id.toString())
  await user.save()

  response.status(204).end()
})

module.exports = blogsRouter