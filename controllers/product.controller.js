const Product = require('../models/product.model');
const SubCategory = require('../models/subcategory.model');
const mongoose = require('mongoose');

// exports.createProduct = async (req, res) => {
//     try
//     {
//         // cache.del('products');  
//     const { name, desc, price, subCategoryId } = req.body;
//     const subCategory = await SubCategory.findById(subCategoryId);
//     if(!subCategory) return res.status(404).json({message:"SubCategory Not Found"})

//     const imgURL = req.file.filename
//     const myProduct = await Product.create({ name, desc, price, imgURL , subCategory: subCategory._id });

//     // logger.info(`admin create new product ${myProduct.id}`)

//     res.status(201).json({ message : 'Product Created', myProduct});
//     }
//     catch(err){
//         // logger.error(`admin create error ${err.message} , data ${req.body}`)

//         res.status(500).json({
//             message: 'Faild to create product',
//             error:err.message
//         })
//     }
// }


// This is for using name of SubCategory not ID
exports.createProduct = async (req, res) => {
    try {
        const { name, desc, price, stock, subCategory } = req.body;
        const imgURL = req.file.filename;

        
        let subCategoryId = subCategory;
        if (!mongoose.Types.ObjectId.isValid(subCategory)) {
            const subCatDoc = await SubCategory.findOne({ name: subCategory });
            if (!subCatDoc) {
                return res.status(400).json({ message: 'Invalid subCategory name' });
            }
            subCategoryId = subCatDoc._id;
        }

        const myProduct = await Product.create({
            name,
            desc,
            price,
            stock: parseInt(stock) || 0,
            imgURL,
            subCategory: subCategoryId
        });

        res.status(201).json({ message: 'Product Created', myProduct });
    } catch (err) {
        res.status(500).json({
            message: 'Failed to create product',
            error: err.message
        });
    }
};


// Pagination 
exports.getProducts = async (req, res) => {
    const products = await Product.find();
    //  res.status(201).json({ message : 'List of products', data: products});
    res.status(200).json(res.paginatedResult);
}

exports.getProductById =async (req,res)=>{
    const id = req.params.id;
    const product = await Product.findById(id);
    if(product){
        res.status(200).json({message: 'Product Data',data:product});
    }else{
        res.status(404).json({message:'Product Not Found'})
    }
}

exports.getRelatedProducts =async (req,res)=>{
    const id = req.params.id;
    const product = await Product.where('_id').ne(id).limit(6)         // Get 5 more products without the one i get before
    if(product){
        res.status(200).json({message: 'Product Data',data:product});
    }else{
        res.status(404).json({message:'Product Not Found'})
    }
}

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product Not Found' });
    }

    const { name, desc, price, stock, subCategory } = req.body;

    // Handle image update if file was uploaded
    let imgURL = product.imgURL;
    if (req.file) {
      imgURL = req.file.filename;
    }

    // Handle subCategory (string name or ID)
    let subCategoryId = subCategory || product.subCategory;
    if (subCategory && !mongoose.Types.ObjectId.isValid(subCategory)) {
      const subCatDoc = await SubCategory.findOne({ name: subCategory });
      if (!subCatDoc) {
        return res.status(400).json({ message: 'Invalid subCategory name' });
      }
      subCategoryId = subCatDoc._id;
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name || product.name,
        desc: desc || product.desc,
        price: price || product.price,
        stock: parseInt(stock) || product.stock,
        imgURL,
        subCategory: subCategoryId
      },
      { new: true }
    );

    res.status(200).json({ message: 'Product Updated', updatedProduct });

  } catch (err) {
    res.status(500).json({
      message: 'Failed to update product',
      error: err.message
    });
  }
};


// Normal Get Data
// exports.getProducts = async (req, res) => {
//   const products = await Product.find();
//   res.status(200).json({ message: "list of products", data: products });
// };

