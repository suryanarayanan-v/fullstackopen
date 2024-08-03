require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const People = require('./models/people')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  const originalJson = res.json
  res.json = function(body) {
    res.locals.responseBody = body
    return originalJson.call(this, body)
  }
  next()
})

morgan.token('response-body', (req, res) => {
  return JSON.stringify(res.locals.responseBody)
})

morgan.token('body', function (req) {
  return JSON.stringify(req.body)
})


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body :response-body'))

app.get('/api/persons', (request, response, next) => {
  People.find({}).then((result) => {
    response.json(result)
  })
    .catch(error => next(error))
})


app.get('/info', (request, response) => {
  People.countDocuments({}).then((result) => {
    const info = `<div>
            Phone has info for ${result} people
            <br/>
            ${Date()}
        </div>`
    response.send(info)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  People.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
  People.findByIdAndDelete(request.params.id)
    .then(
      response.status(204).end()
    )
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name || !body.number) {
    const error = { error: 'invalid request body' }
    return response.status(400).json(error)
  }

  const person = new People({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    console.log('person saved!')
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const newPerson = {
    name: request.body.name,
    number: request.body.number,
  }
  People.findByIdAndUpdate(request.params.id, newPerson, { new: true, runValidators: true, context: 'query' })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'ill formatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Listening on ${PORT}`))