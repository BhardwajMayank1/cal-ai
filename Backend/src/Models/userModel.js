const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    avatar:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true  
    },
    password:{
        type:String,
        require:true
    }

},{timestamps:true})

const userModel = mongoose.model("User",userSchema)
module.exports = userModel