import {useEffect, useState} from 'react'
import personService from './services/persons.js'
import {Filter} from "./components/Filter.jsx";
import {PersonForm} from "./components/PersonForm.jsx";
import {Persons} from "./components/Persons.jsx";

const Notification = ({ notification }) => {
    if (notification === null) {
        return null
    }

    return (
        <div className={notification.type}>
            {notification.message}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [notification, setNotification] = useState(null)

    useEffect(() => {
        console.log('gettingdata')
        personService
            .getAll()
            .then(personsData => {
                setPersons(personsData)
            })
    }, [])


    const handleNewName = (event) => {
        setNewName(event.target.value)
    }

    const handleNewNumber = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilter = (event) => {
        setFilter(event.target.value)
    }

    const deletePerson = (id) => {
        const person = persons.find(person => person.id === id)
        if (confirm(`Are you sure you want to delete ${person.name}?`)) {
            personService
                .deletePerson(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id))
                })
        }
    }

    const addContact = (event) => {
        event.preventDefault()
        const newPerson = { name: newName, number: newNumber }
        if (persons.some(person => person.name === newName)) {
            const person = persons.find(person => person.name === newName )
            if (confirm(`${newPerson.name} is already added to phonebook, replace the old number with new one?`)) {
                personService
                    .replacePerson(newPerson, person.id)
                    .then(replacedPerson => {
                        setPersons(persons.map(person => {
                            if (person.id === replacedPerson.id) {
                                return replacedPerson
                            } else {
                                return person
                            }
                        }))
                    })
                    .catch((error) => {
                        const errorNotification = {
                            message: error.response.data,
                            type: 'error'
                        }
                        setNotification(errorNotification)
                        setTimeout(() => setNotification(null), 5000)
                    })
            }
        }
        else {
            personService
                .createPerson(newPerson)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewNumber('')
                    setNewName('')
                    const successNotification = { message: `Added ${returnedPerson.name}`,
                    type: 'success' }
                    setNotification(successNotification)
                    setTimeout(() => {
                        setNotification(null)
                    }, 5000)
                })
                .catch(error => {
                    console.log(error)
                    const errorNotification = {
                        message: error.response.data.error,
                        type: 'error'
                    }
                    setNotification(errorNotification)
                    setTimeout(() => setNotification(null), 5000)
                    console.log(error.response)
                })
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification notification={notification}/>
            <Filter filter={filter} handleFilter={handleFilter}/>
            <h3>Add a new</h3>
            <PersonForm addContact={addContact} newName={newName} handleNewName={handleNewName}
                        handleNewNumber={handleNewNumber} newNumber={newNumber}/>
            <h2>Numbers</h2>
            <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
        </div>
    )
}

export default App