const mongoose = require('mongoose');
const {Schema} = mongoose;

const CategorySchema = new Schema({
    label:{
        type:String,
        required:true,
        unique:true,
    },value:{
        type:String,
        required:true,
        unique:true,
    },
});

exports.Category = mongoose.model('Category',CategorySchema);