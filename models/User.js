const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName : {
        type : String,
    },
    lastName : {
        type : String,
    },
    email : {
        type : String,
    },
    phone : {
        type : Number,
    },
    password : {
        type : String,
    },
    role : {
        type : String,
    },
    isDeleted : {
        type : Number,
        required : true,
        default: 0,
    },
},{ timestamps : true })

const UserModel = mongoose.model('users',UserSchema)

module.exports = UserModel