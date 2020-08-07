require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')


const app = express()
const PORT = process.env.PORT


//express middlewares
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('person', function (req) {
  return req.method === 'POST' ? JSON.stringify(req.body) : null
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
//


//models
const Person = require('./models/person')
//


app.get('/info', (request, response) => {
  Person.estimatedDocumentCount({})
    .then(count => {
      const date = new Date()
      response.send(
        `
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p> 
        `
      )
    })

})

app.get('/api/persons', (request, response, next) => {
  Person.find()
    .then(persons => {
      response.json(persons)
    })
    .catch(next)
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(next)
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(next)
})

app.put('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndUpdate(request.params.id, { number: request.body.number }, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(next)
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({ name: body.name, number: body.number })
  person.save()
    .then(newPerson => response.json(newPerson))
    .catch(next)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    if (error.errors.name !== undefined && error.errors.name.kind === 'unique') {
      return response.status(409).json({ error: `${error.errors['name'].value} is already added to the phonebook` })
    }
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})