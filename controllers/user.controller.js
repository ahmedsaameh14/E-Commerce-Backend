const User = require('../models/user.model')
const catchAsync = require('../utils/catch-async.util');
const AppError = require('../utils/app-error.util');

exports.createUser = (role)=>{
    return catchAsync( async(req,res,next)=>{
        const {name,email,password}= req.body;

        if(!['admin','user'].includes(role)){
            return next(new AppError('Invalid Role',400))
        }
        const existing = await User.findOne({email});
        if(existing){
            return next(new AppError('Email Already Exist'))
        }
        const user = await User.create({name , email , password , role});
        res.status(201).json({message: 'User Created' , user})
    })
    }
    
exports.getUser = async (req,res) =>{
    const user = await User.find();
    res.status(201).json({message: 'List of Users' , data: user})
}
