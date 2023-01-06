const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
    name: String,
    password: String,
    email: String
})

module.exports = new mongoose.model('admin', adminSchema)