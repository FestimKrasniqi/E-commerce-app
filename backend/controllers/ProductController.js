const product = require('../models/Product')

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
        res.status.json(200).json(Product)
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getProductById = async(req, res) => {

    try {
        const { productId } = req.params.pid
        const Product = await product.findById({productId})
        if(!Product) {
            res.status(404).json({message : "Product not found"})
        }
        res.status(200).json(product);
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
        const deletedProduct = await Product.findByIdAndDelete(req.params.pid);
        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    
        res.status(200).json({ message: 'Product deleted' });
       
      
         } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' })
    }
}


const searchAndFilterProducts = async (req, res) => {


    try {
    const { keyword, category, minPrice, maxPrice } = req.query;

    const filter = {};

    // Search by keyword in title or description
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const products = await product.find(filter);

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
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