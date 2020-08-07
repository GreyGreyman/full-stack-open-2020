import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personServices from './services/persons'
import Notification from './components/Notification'




const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')
  const [notification, setNotification] = useState({ message: '', state: 'success' })

  function notificationHelper(message, state) {
    setNotification({ message, state })
    setTimeout(() => { setNotification({ message: '', state: 'success' }) }, 5000)
  }

  useEffect(() => {
    personServices.getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])


  const addPerson = (event) => {
    event.preventDefault()

    let existingPerson
    if (persons.some(person => { existingPerson = person; return person.name === newName })) {
      if (window.confirm(`${existingPerson.name} is already added to the phonebook, replace old number with the new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        personServices
          .update(updatedPerson.id, updatedPerson)
          .then(data => {
            setPersons(persons.map(person => person.id !== updatedPerson.id ? person : data))
            setNewName('')
            setNewNumber('')
            notificationHelper(`${data.name}'s old number replaced to ${data.number}`, 'success')
          })
          .catch(error => {
            notificationHelper(error.response.data.error, 'error')
          })
      }
      return
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    }

    personServices
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        notificationHelper(`Added ${returnedPerson.name}`, 'success')
      })
      .catch(error => {
        notificationHelper(error.response.data.error, 'error')
      })
  }


  const handlePersonDelete = personToDelete => {
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      personServices
        .remove(personToDelete.id)
        .then(response => {
          setPersons(persons.filter(person => person.id !== personToDelete.id))
          notificationHelper(`Deleted ${personToDelete.name}`, 'success')
        })
        .catch(error => {
          setPersons(persons.filter(person => person.id !== personToDelete.id))
          notificationHelper(`Information of ${personToDelete.name} has already been removed from the server`, 'error')
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }


  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(nameFilter.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification {...notification} />
      <Filter {...{ nameFilter, handleNameFilterChange }} />
      <h2>Add new contact</h2>
      <PersonForm {...{ addPerson, newName, handleNameChange, newNumber, handleNumberChange }} />
      <h2>Contacts:</h2>
      <Persons persons={filteredPersons} handlePersonDelete={handlePersonDelete} />
    </div>
  )
}

export default App