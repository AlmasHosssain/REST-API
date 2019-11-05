const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    id:{
        type : Number,
        required : true
    },
    name : {
        type : String,
        required : true
    },
    code : {
        type : String,
        required : true
    }
})

const User = mongoose.model('User',userSchema)
module.exports = User