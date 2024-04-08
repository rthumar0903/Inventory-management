const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const { Mongoose } = require('mongoose');
const JWT_SECRET_KEY = '53f4c56ad629172e5c97d5ce767b0cddd102f35fb37280757dea75c78c66c5d3'

exports.register = async (req, res, next) => {
    const { username, password } = req.body;
    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            password: hashedPassword,
            
        });

        res.status(200).json({
            message: "User successfully created",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: "User not successfully created",
            error: error.message,
        });
    }
};


exports.login = async (req, res, next) => {
  try {
  const { username, password } = req.body
  // Check if username and password is provided
  if (!username || !password) {
    return res.status(400).json({
      message: "Username or Password not present",
    })
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET_KEY, 
        { expiresIn: '1h' }
      );
      res.status(200).json({
        message: "Login successful",
        user:{userId:user?._id,userName:user?.username,userToken:token},
      });
    } else {
      res.status(401).json({
        message: "Login not successful",
        error: "Incorrect password",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};