const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.blrik.mongodb.net/personApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
    name: "Arto Hellas",
    number: "nuevo número",
});

person.save().then((result) => {
    console.log("person saved!");
    mongoose.connection.close();
});

// Person.find({}).then((result) => {
//     result.forEach((person) => {
//         console.log(person);
//     });
//     mongoose.connection.close();
// });
