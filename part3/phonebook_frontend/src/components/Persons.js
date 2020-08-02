import React from 'react'
import Person from './Person'

const Persons = ({ persons, handlePersonDelete }) => {


  return (
    <ul>
      {persons.map(person =>
        <Person
          key={person.id}
          person={person}
          handlePersonDelete={handlePersonDelete} />
      )}
    </ul>
  )
}

export default Persons