const Product = require('../models/product.model');

exports.createPoduct = async (req, res) => {
    try
    {
        // cache.del('products');  
    const { name, desc, price } = req.body;
    const imgURL = req.file.filename
    const myProduct = await Product.create({ name, desc, price, imgURL });

    // logger.info(`admin create new product ${myProduct.id}`)

    res.status(201).json({ message : 'Product Created', myProduct});
    }
    catch(err){
        logger.error(`admin create error ${err.message} , data ${req.body}`)

        res.status(500).json({
            message: 'Faild to create product',
            error:err.message
        })
    }
}

// Pagination 
exports.getProducts= async(req,res)=>{
    const products = await Product.find();
    //  res.status(201).json({ message : 'List of products', data: products});
    res.status(200).json(res.paginatedResult);
}


// Normal Get Data
// exports.getProducts = async (req, res) => {
//   const products = await Product.find();
//   res.status(200).json({ message: "list of products", data: products });
// };

