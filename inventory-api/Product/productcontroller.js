const Product = require('../model/product');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const JWT_SECRET_KEY = '53f4c56ad629172e5c97d5ce767b0cddd102f35fb37280757dea75c78c66c5d3'

exports.createProduct = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token is missing or invalid' });
    }
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY); 
    if (!decodedToken.userId) {
      return res.status(401).json({ success: false, message: 'Invalid authorization token' });
    }

    const { name, category, price, quantity, description } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      quantity,
      description,
      userId: new mongoose.Types.ObjectId(decodedToken.userId)
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.log('product error',error)
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token is missing or invalid' });
    }
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);

    if (!decodedToken.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const userIdObj = new mongoose.Types.ObjectId(decodedToken?.userId);
    const products = await Product.find( {userId:userIdObj} );
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products by userId:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token is missing or invalid' });
    }
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY); 
    if (!decodedToken.userId) {
      return res.status(401).json({ success: false, message: 'Invalid authorization token' });
    }

    const productId = req.params.productId;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.userId.toString() !== decodedToken.userId) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(productId);

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const authToken = req.headers.authorization;

    if (!authToken || !authToken.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token is missing or invalid' });
    }
    const token = authToken.split(' ')[1];
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY); 

    if (!decodedToken.userId) {
      return res.status(401).json({ success: false, message: 'Invalid authorization token' });
    }

    const productId = req.params.productId;

    let product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.userId.toString() !== decodedToken.userId) {
      return res.status(403).json({ success: false, message: 'You are not authorized to edit this product' });
    }

    const { name, category, price, quantity, description } = req.body;
    product.name = name;
    product.category = category;
    product.price = price;
    product.quantity = quantity;
    product.description = description;

    product = await product.save();

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error('Error editing product:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};