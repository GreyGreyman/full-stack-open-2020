const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })

  let passwordCheck = false
  if (user !== null) {
    passwordCheck = await bcrypt.compare(password, user.passwordHash)
  }

  if (!passwordCheck || user === null) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  const token = jwt.sign({ username, id: user._id }, process.env.SECRET)

  response.send({ token, username, name: user.name })
})

module.exports = loginRouter