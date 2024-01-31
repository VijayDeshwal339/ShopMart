const mongoose = require('mongoose');
const { Schema } = mongoose;

const BrandSchema = new Schema({
    label:{
        type:String,
        required:true,
        unique:true,
    },
    value:{
        type:String,
        required:true,
        unique:true,
    }
})

exports.Brand = mongoose.model("Brand",BrandSchema);