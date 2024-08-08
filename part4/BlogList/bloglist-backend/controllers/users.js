const User = require('../models/user')
const userRouter = require("express").Router();
const bcrypt = require("bcrypt");

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  if (password.length <= 3) {
    return response.status(400).json({ error: 'password too short' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username: username,
    name: name,
    passwordHash: passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).
  populate('blogs', { url: 1, title: 1, author: 1 })
  response.json(users)
})

module.exports = userRouter