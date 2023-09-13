const mongoose =  require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String, 
        required:true,
        trim:true
    },
    lastName:{
        type:String, 
        required:true,
        trim:true
    },
    email:{
        type:String, 
        required:true,
        trim:true
    },
    password:{
        type:String, 
        required:true,
        trim:true
    },
    accountType:{
        type:String, 
        enum:["Student","Instructor","Admin"],
        required:true,
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"Profile",
        required:true, //watch for this required or not
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"Course",
    }],
    token:{
        type: String
    },
    resetPasswordExpires:{
        type: Date
    },
    image:{
        type:String,
        required:true
    },
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress"
    }],
    active: {
        type: Boolean,
        default: true,
    },
    approved: {
        type: Boolean,
        default: true,
    },
})

module.exports = mongoose.model("User", userSchema);