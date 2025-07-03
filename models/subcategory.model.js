const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name :{
        type:String,
        required:true,
        unique: true
    }
})

module.exports = mongoose.model('SubCategort',subCategorySchema);