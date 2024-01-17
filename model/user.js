const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema =  Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type: String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required: true
    },
    role:{
        type:String,
        default:"user"
    },
    // addresses: { type: [Schema.Types.Mixed] }, 
   
}, {timestamps:true}
);

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;