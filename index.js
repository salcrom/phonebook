const express = require("express");
const morgan = require("morgan");
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

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/info", (request, response) => {
    const person = persons.length;
    const date = new Date().toString();

    response.send(`<p>Phonebook has info for ${person} people</p>
        <p>${date}</p>`);
});

app.get("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find((person) => person.id === id);

    // console.log({ id, person });

    if (person) {
        response.json(person);
    } else {
        response.status(404).send({
            message: "Person not found",
        });
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
});

const generateId = () => {
    const maxId =
        persons.length > 0
            ? Math.floor(Math.random(...persons.map((p) => p.id)) * 1000)
            : 0;

    return maxId + 1;
};
// Añaadir al principio "app.use(express.json());"
app.post("/api/persons", (request, response) => {
    const body = request.body;
    // console.log("body", body);
    const personName = persons.find((person) => body.name === person.name);
    // console.log({ personName });

    if (personName) {
        if (!body.name || !body.number) {
            return response.status(400).json({
                error: "name or number missing",
            });
        }

        if (body.name === personName.name) {
            return response.status(400).json({
                error: "name must be unique",
            });
        }
    } else {
        const person = {
            name: body.name,
            number: body.number,
            id: generateId(),
        };
        persons = persons.concat(person);

        response.json(person);
    }
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3000;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);
