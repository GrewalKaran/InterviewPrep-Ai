const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique :[true,"username already exist"]
    },
    email:{
        type: String,
        required: true,
        unique :[true,"email already exist"]
    },
    password:{
        type: String,
        required: true
    }

})

const userModel = mongoose.model('Users',userSchema)

module.exports = userModel