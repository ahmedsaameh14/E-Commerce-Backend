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


productSchema.post('findOneAndUpdate', async (doc) => {
    if (!doc) return
    try {
        const productId = doc._id
        const newPrice = doc.price
        const cartItems = await Cart.find({
            productId, isPurchased: false
        })
        for (const item of cartItems) {
            if (item.currentPrice !== newPrice) {
                item.currentPrice = newPrice;
                item.priceChanged = true;
                await item.save();
            }
        }
    } catch (error) {
        res.send(500).json({ error: error })
    }
})

module.exports = mongoose.model('Product', productSchema);