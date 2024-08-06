const express = require('express')
require('express-async-errors')
const app = express()
const config = require('./utils/config')
const cors = require('cors')
const mongoose = require('mongoose')
const Blogs = require('./controllers/blogs')


const mongoUrl = config.MONGO_URI
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', Blogs)

module.exports = app