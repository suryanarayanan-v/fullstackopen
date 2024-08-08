const logger = require("./logger")

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if (authorization) {
    request.token = authorization.replace('Bearer ', '')
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
  }
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  tokenExtractor
}