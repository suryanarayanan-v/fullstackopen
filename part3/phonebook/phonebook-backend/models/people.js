const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Connection to mongoDB failed', error))

const peopleSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        console.log('value is', value)
        return /^\d{2,3}-\d+$/.test(value)
      },
      message: 'Invalid number format'
    }
  },
})

peopleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('People', peopleSchema)