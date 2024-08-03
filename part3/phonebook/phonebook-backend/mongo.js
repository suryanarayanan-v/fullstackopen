const mongoose = require('mongoose')


if (process.argv.length < 3 || process.argv.length > 5) {
  console.log('invalid args')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://suryanvenkat:${password}@cluster0.j4ydpih.mongodb.net/phonebookApp?
    retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)


const peopleSchema = new mongoose.Schema({
  name: String,
  number: String
})
mongoose.connect(url)
const People = new mongoose.model('People', peopleSchema)

if (process.argv.length === 3) {
  console.log('phonebook-backend:')
  People.find({}).then(result => {
    result.forEach(note => {
      console.log(`${note.name} ${note.number}`)
    })
    mongoose.connection.close()
    process.exit(0)
  })
} else {
  const person = new People({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(() => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}


