const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    verify_email:{
        type:String,
        require:true
    },
    url:{
        type:String,
        require:true
    },
    sort:{
        type:Number,
        require:true
    }
})

const User = new mongoose.model("user",userSchema)
module.exports = User