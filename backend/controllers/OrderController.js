const Order = require('../models/Order');
const Product = require('../models/Product')


const getAllOrders = async (req,res) => {
    try {
        const order = await Order.find().populate("user","name email").populate("products.product","name price");
        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getOrderById = async (req,res) => {
    try {
        const orderId = req.params.oid
        const order = await Order.findById(orderId).populate("user","name email").populate("products.product","name price")
        if (!order) {
          return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order)

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const getMyOrder = async (req,res) => {
    try {
        const order = await Order.find({user: req.user.id}).populate('products.product',"name price").sort({createdAt: -1})
        res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ message: "Server error" });
    }
}

const createOrder = async (req,res) => {
    try {
        const { products, shippingInfo } = req.body;

        if (!products || products.length === 0) {
          return res.status(400).json({ message: "No products in order" });
        }

        const processedProducts = [];

        for (const item of products) {
          const productDoc = await Product.findOne({
            name: new RegExp(`^${item.product}$`, "i"),
          });
    
          if (!productDoc) {
            return res.status(404).json({ message: `Product not found: ${item.product}` });
          }
    
          processedProducts.push({
            product: productDoc._id,
            quantity: item.quantity,
          });
        }

        const order = new Order({
          user: req.user.id,
          products: processedProducts,
          shippingInfo,
         
         
        });

        const savedOrder = await order.save();

        res.status(201).json(savedOrder);
    
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const deleteOrder = async (req,res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.oid

        const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({ message: "Order not found" });
        }

        if(order.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this order" });
        }

        if(order.status === 'delivered' || (order.deliveredAt && new Date() >= new Date(order.deliveredAt))) {
            return res
              .status(400)
              .json({
                message: "Order cannot be deleted after it is delivered",
              });
        }

        await order.deleteOne();
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Delete order error:", err);
        res.status(500).json({ message: "Server error" });
    }
}


const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.oid;
    const userId = req.user.id;
    const userRole = req.user.role;
    const { products, shippingInfo, paymentInfo, status, deliveredAt } =
      req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only owner or admin can update
    if (order.user.toString() !== userId.toString() && userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to update this order" });
    }

    // Don't allow any updates if order is delivered
    if (
      order.status === "delivered" ) {
      return res
        .status(400)
        .json({ message: "Order cannot be updated after it is delivered" });
    }

    // Prevent normal users from changing admin-only fields
    if (userRole !== "admin") {
      if (status || paymentInfo || deliveredAt) {
        return res.status(403).json({
          message:
            "Only admins can update order status, payment info, or delivery date",
        });
      }
    }

    // Update products if provided
    if (products) {
      const processedProducts = [];
      for (const item of products) {
        const productDoc = await Product.findOne({ name: item.product });
        if (!productDoc) {
          return res
            .status(404)
            .json({ message: `Product not found: ${item.product}` });
        }
        processedProducts.push({
          product: productDoc._id,
          quantity: item.quantity,
        });
      }
      order.products = processedProducts;
    }

    // Update fields if provided
    if (shippingInfo) order.shippingInfo = shippingInfo;
    if (userRole === "admin") {
      if (status) order.status = status;
      if (paymentInfo) order.paymentInfo = paymentInfo;
      if (deliveredAt) order.deliveredAt = deliveredAt;
    }

    const updatedOrder = await order.save();
    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Error updating order:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

  
const countOrders = async (req,res) => {
  try {
    const count = await Order.countDocuments();
    
    return res.status(200).json(count)
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
}



module.exports = {
    getAllOrders,
    getOrderById,
    getMyOrder,
    createOrder,
    deleteOrder,
    updateOrder,
    countOrders

}