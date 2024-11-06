import foodModel from "../models/foodModel.js";
import fs from 'fs';
import jwt from 'jsonwebtoken';
//
const listFoodAll = async (req, res) => {
    try {
        // Extract filters from the request body
        const { college, category } = req.body;
      
        // Build query object
        const query = {};

        if (college) {
            query.college = college;
        }

        if (category) {
            query.category = category;
        }

        // Fetch foods based on the query object
        const foods = await foodModel.find(query);

        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching food items" });
    }
};

const listFood = async (req, res) => {

    try {
        // Extract token from headers
        const token = req.headers.authorization.split(' ')[1];
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        // Fetch orders by user ID
        const orders = await foodModel.find({ seller: decoded.id });
        // console.log(orders);
        res.json({ success: true, data: orders });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

// Add food



const addFood = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    let userId;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        userId = decoded.id;
        console.log(userId);

    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const { name, description, price, category, college } = req.body;
    
    if (!name || !description || !price || !category || !college || !userId) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    
    try {
        // Access uploaded files via req.files
        const images = req.files.map(file => file.path); // Paths to the uploaded files
        console.log(images);
        const newFood = new foodModel({
            name,
            description,
            price,
            images, // Array of file paths
            category,
            college,
            seller: userId
        });
       
        const savedFood = await newFood.save();
        console.log(savedFood);
        res.json({ success: true, data: savedFood });
    } catch (error) {
        console.error('Error adding food:', error);
        res.status(500).json({ success: false, message: "Error adding food" });
    }
};


// Delete food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (food) {
            food.images.forEach(image => {
                fs.unlink(`uploads/${image}`, err => {
                    if (err) console.log(`Failed to delete image ${image}: `, err);
                });
            });

            await foodModel.findByIdAndDelete(req.body.id);
            res.json({ success: true, message: "Food Removed" });
        } else {
            res.json({ success: false, message: "Food not found" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

//
const fetchByCollege = async (req, res) => {
    const { college } = req.params;
    try {
        const foods = await foodModel.find({ college });
        res.json({ success: true, data: foods });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err });
    }
};
const getItemById = async (req, res) => {
    // console.log(req.params.id);
    try {
        const food = await foodModel.findById(req.params.id);

        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }
        res.json({ success: true, data: food });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
const fetchSimilarProducts = async (req, res) => {
    try {
      const product = await foodModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
  
      const similarItems = await foodModel.find({
        college: product.college,
        category: product.category,
        _id: { $ne: product._id } // Exclude the current product from the similar items
      }).limit(10); // Adjust limit as needed
  
      res.json({ success: true, data: similarItems });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
export { listFood, addFood, removeFood,fetchByCollege ,getItemById,fetchSimilarProducts,listFoodAll};
