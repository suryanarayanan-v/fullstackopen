const logger = require("./logger")

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  logger.error(err.message)

  if (err.name === 'ValidationError') {
    res.status(400).json({ error: 'username too short' });
  } else if (err.message.includes('E11000 duplicate key error')) {
    res.status(400).json({ error: 'username expected to be unique' });
  }
}

module.exports = {
  errorHandler,
  unknownEndpoint
}