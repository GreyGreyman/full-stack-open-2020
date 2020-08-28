const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {

  const { username, name, password } = request.body

  const PASSWORD_LENGTH = 3
  if (password === undefined) {
    return response.status(400).json({ error: 'password is required' })
  } else if (password.length < PASSWORD_LENGTH) {
    return response.status(400).json({ error: `is shorter than the minimum allowed length (${PASSWORD_LENGTH}` })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({ username, name, passwordHash })

  const savedUser = await user.save()
  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = 
    await User.find({}).populate('blogs', {url: 1, title: 1, author: 1, id: 1, likes: 1})
  response.json(users)
})

module.exports = usersRouter