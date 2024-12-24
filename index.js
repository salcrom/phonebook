require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();
const cors = require("cors");

app.use(express.json()); //Para las peticiones POST->obtener el body
app.use(express.static("dist"));
app.use(cors());

// Configuración básica de morgan con 'tiny'
// app.use(morgan("tiny"));

// Configuración personalizada que incluye el body en POST requests
morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

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

app.get("/api/persons", (request, response) => {
    Person.find({}).then((person) => {
        response.json(person);
    });
});

app.get("/info", (request, response) => {
    Person.find({}).then((person) => {
        response.json(person);
    });
});

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then((person) => {
            response.json(person);
        })
        .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then((result) => {
            response.status(204).end();
        })
        .catch((error) => next(error));
});

// Añaadir al principio "app.use(express.json());"
app.post("/api/persons", (request, response) => {
    const body = request.body;
    // console.log("body", body);
    if (body.name === undefined) {
        return response.status(400).json({
            error: "name missing",
        });
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then((savedPerson) => {
        response.json(savedPerson);
    });
});

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then((updatedPerson) => {
            response.json(updatedPerson);
        })
        .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
