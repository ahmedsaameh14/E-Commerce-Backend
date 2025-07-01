const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    desc:String,
    imgURL:{
        type:String,
        require:true
    },
    stock:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
})

module.exports = mongoose.model('Product', productSchema);