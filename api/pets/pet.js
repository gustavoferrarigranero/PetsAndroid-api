const mongoose = require('mongoose')

const petSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: String, required: true },
    picture: { type: String, required: true },
})

module.exports = mongoose.model('Pet', petSchema)