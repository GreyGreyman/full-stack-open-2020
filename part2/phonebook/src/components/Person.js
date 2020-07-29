import React from 'react'

const Person = ({ person, handlePersonDelete }) => (
    <li>
        {person.name} {person.number}
        <button onClick={() => handlePersonDelete(person)}>delete</button>
    </li>
)
export default Person