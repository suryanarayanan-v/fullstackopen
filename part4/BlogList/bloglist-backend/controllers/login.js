const bcrypt = require('bcrypt')
const User = require('../models/user')
const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  if (!user) return response.status(401).json({ error: 'username not found' })

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  if (!passwordCorrect) return response.status(401).json({ error: 'incorrect password' })

  const userForToken = {
    username: user.username,
    id: user.id
  }
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

  response.send({token, username: user.username, name: user.name })
})

module.exports = loginRouter