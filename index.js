require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json()) //Para las peticiones POST->obtener el body
app.use(express.static('dist'))
app.use(cors())

// Configuración básica de morgan con 'tiny'
// app.use(morgan("tiny"));

// Configuración personalizada que incluye el body en POST requests
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :body'
  )
)

// let persons = [
//     {
//         id: 1,
//         name: "Arto Hellas",
//         number: "040-123456",
//     },
//     {
//         id: 2,
//         name: "Ada Lovelace",
//         number: "39-44-5323523",
//     },
//     {
//         id: 3,
//         name: "Dan Abramov",
//         number: "12-43-234345",
//     },
//     {
//         id: 4,
//         name: "Mary Poppendieck",
//         number: "39-23-6423122",
//     },
// ];

// const password = process.argv[2];

app.get('/api/persons', async (request, response) => {
  try {
    const persons = await Person.find({})
    response.json(persons)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

app.get('/info', async (request, response) => {
  try {
    const persons = await Person.find({})
    response.json(persons)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person)
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// Añaadir al principio "app.use(express.json());"
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'El nombre y número son obligatorios',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, content: 'query' }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
