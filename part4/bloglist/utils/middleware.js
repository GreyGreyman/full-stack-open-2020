let morgan = require('morgan')

morgan.token('body', function (req) {
  return req.method === 'POST' ? JSON.stringify(req.body) : null
})
morgan = morgan(':method :url :status :res[content-length] - :response-time ms :body')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  request.token =
    authorization && authorization.toLowerCase().startsWith('bearer ') ?
      authorization.substring(7) :
      null

  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  morgan,
  tokenExtractor,
  unknownEndpoint,
  errorHandler
}