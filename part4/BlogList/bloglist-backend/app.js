const express = require('express')
require('express-async-errors')
const app = express()
const config = require('./utils/config')
const cors = require('cors')
const mongoose = require('mongoose')
const Blogs = require('./controllers/blogs')
const Users = require('./controllers/users')
const Login = require('./controllers/login')
const middleware = require('./utils/middleware')

app.use(middleware.tokenExtractor)

const mongoUrl = config.MONGO_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', Blogs)
app.use('/api/users', Users)
app.use('/api/login', Login)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app