const product = require('../models/Product')
const fs = require('fs');

const createProduct = async (req,res) => {
    try{
        const {name,description,price,category,stock} = req.body

        const newProduct = new product({
            name,
            description,
            price,
            category,
            stock,
            image: req.file.path

        })

        await newProduct.save();

        res.status(201).json({message: "Product created with success", product:newProduct})
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getAllProducts = async (req,res) => {
    try {
        const Product = await product.find()
        res.status(200).json(Product)
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getProductById = async(req, res) => {

    try {
        const productId = req.params.pid
        const Product = await product.findById(productId)
        if(!Product) {
            res.status(404).json({message : "Product not found"})
        }
        res.status(200).json(Product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const updateProduct = async(req, res) => {
    try {
      const { name, description, price, category, stock } = req.body;
      const updateData = { name, description, price, category, stock };

      if (req.file) 
        updateData.image = req.file.filename;

      const updatedProduct = await product.findByIdAndUpdate(
        req.params.pid,
        updateData,
        {
          new: true,
        }
      );

      if (!updatedProduct)
        return res.status(404).json({ message: "Product not found" });

      res
        .status(200)
        .json({ message: "Product updated", product: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Server error" });
    }
}



    const deleteProduct = async (req,res) => {


        try {
        const deletedProduct = await product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

        const imagePath = deletedProduct.image

        fs.unlink(imagePath, (err) => {
          console.log(err);
        });
    
        res.status(200).json({ message: 'Product deleted' });
       
      



         } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' })
    }
}


const searchAndFilterProducts = async (req, res) => {


  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    // Keyword search (name or description)
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // In-stock only
    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Total count for frontend pagination
    const total = await product.countDocuments(filter);

    // Fetch products with filters
    const products = await product.find(filter)
      .sort({ [sortBy]: order === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchAndFilterProducts
}