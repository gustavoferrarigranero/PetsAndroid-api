const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: String, required: true },
    pass: { type: String, required: true },
    picture: { type: String, required: true },
    pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }]
})

module.exports = mongoose.model('User', userSchema)