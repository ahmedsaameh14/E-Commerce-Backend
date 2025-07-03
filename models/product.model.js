const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    desc:String,
    imgURL:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        defult:0
    },
    subCategory:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required:true
    }
},
{
    timestamps:true
})

module.exports = mongoose.model('Product', productSchema);