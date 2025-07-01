const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user' , 'admin'],
    default: 'user'
  },
},
{  timestamps:true });

userSchema.pre('save' , async function(next){
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password , 10);      
    next();
})

userSchema.methods.correctPassword = async function(inputPassword){      
    return await bcrypt.compare(inputPassword , this.password);
}


module.exports = mongoose.model('User',userSchema);