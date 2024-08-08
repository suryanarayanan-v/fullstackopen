const logger = require("./logger")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.decode(request.token)
  if (decodedToken) {
    request.user = await User.findById(decodedToken.id)
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  logger.error(err.message)

  if (err.name === 'ValidationError') {
    res.status(400).json({ error: 'username too short' })
  } else if (err.message.includes('E11000 duplicate key error')) {
    res.status(400).json({ error: 'username expected to be unique' })
  } else if (err.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'token expired' })
  } else if (err.name === 'CastError') {
    res.status(400).json({ error: 'illegal id' })
  } else if (err.message.includes('Cannot read properties of')) {
    res.status(401).json({ error: 'Authorization invalid' })
  }
  res.status(500).json({ error: err.name })
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  userExtractor,
  tokenExtractor
}