const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'El nombre debe de tener al menos 3 caracteres'],
    required: [true, 'El nombre es obligatorio'],
    trim: true,
  },
  number: {
    type: String,
    required: [true, 'El número de teléfono es obligatorio'],
    minLength: [8, 'El número debe de tener al menos 8 caracteres'],
    validate: {
      validator: function (value) {
        // Validación del formato del número de teléfono
        return (
          /^(\d{2,3})-(\d+)$/.test(value) &&
                    value.length >= 8 &&
                    value.split('-')[1].length >= 1 &&
                    !value.split('-')[1].includes('-')
        )
      },
      message: (props) =>
        `${props.value} no es un número válido. ` +
                'El formato debe de ser XX-XXXXXX o XXX-XXXXX ' +
                'donde X es un número, con longitud total mínima de 8 caracteres',
    },
    trim: true,
  },
})

// Middleware pre-save para validación adicional
personSchema.pre('save', function (next) {
  const phoneNumber = this.number
  if (phoneNumber) {
    const parts = phoneNumber.split('-')

    // Validación adicional de las partes
    if (parts.length !== 2) {
      next(
        new Error(
          'El número debe tener exactamente una parte antes y después del guión'
        )
      )
      return
    }

    const [firstPart, secondPart] = parts

    // Validar primera parte (2-3 dígitos)
    if (!/^\d{2,3}$/.test(firstPart)) {
      next(new Error('La primera parte debe tener 2 o 3 dígitos'))
      return
    }

    // Validar segunda parte (solo dígitos)
    if (!/^\d+$/.test(secondPart)) {
      next(new Error('La segunda parte debe contener solo dígitos'))
      return
    }
  }
  next()
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
