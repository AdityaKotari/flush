const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    },
    toiletsLeased:{
        type:[ObjectId],
        ref: "Toilet"
    }

})

module.exports = mongoose.model("User", userSchema, 'users')