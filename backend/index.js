require('dotenv').config();
const config = require('./config.json');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utils/utilities');
const User = require('./models/user.model');
const validator = require('validator');

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.post('/set-email', async (req, res) => {
    console.log("POST /set-email called");  // Log endpoint call
    const { fullName, email } = req.body;

    // Validate required fields
    if (!fullName || !email) {
        return res.status(400).json({ error: true, message: "Please enter all fields" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: true, message: "Invalid email" });
    }

    // Check if the email is already in use
    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
    }

    // Since we're only validating, return success without creating a new user
    return res.status(200).json({
        error: false,
        message: "Email is valid and available."
    });
});

app.post('/set-password', async (req, res) => {
    console.log("POST /set-password called");  // Log endpoint call
    const { fullName, email, username, password, confirmPassword } = req.body;

    // Check for required fields
    if (!fullName || !email || !username || !password || !confirmPassword) {
      return res.status(400).json({ error: true, message: "Missing required fields" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: true, message: "Invalid email" });
    }

    // Ensure both password fields match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: true, message: "Passwords do not match" });
    }

    // Check if the username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: true, message: "Username is already taken" });
    }

    // Check if the email is already in use (if needed)
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: true, message: "Email is already in use" });
    }

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({
        fullName,
        email,
        username,
        password: hashedPassword,
      });

      await user.save();

      // Create the JWT token for the new user
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h" }
      );

      return res.status(200).json({
        error: false,
        message: "Account created successfully",
        user: { fullName: user.fullName, email: user.email, username: user.username },
        accessToken,
      });
    } catch (error) {
      console.error("Error creating account:", error);
      return res.status(500).json({ error: true, message: "Server error" });
    }
});

app.post('/login', async (req, res) => {
    console.log("POST /login called");  // Log endpoint call
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and Password are requiured" });
    }

    const query = validator.isEmail(email) ? { email: email } : { username: email };

    // Looks for user email
    const user = await User.findOne(query);
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    // Validates password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid Password" });
    }

    // Gets access token from login
    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h" }
    );

    // Successful login
    return res.json({
        error: false,
        message: "Login Successful",
        user: { fullName: user.fullName, email: user.email },
        accessToken,
    });
});

app.get('/get-user', authenticateToken, async (req, res) => {
    console.log("GET /get-user called");  // Log endpoint call
    const { userId } = req.user;

    const isUser = await User.findOne({ _id: userId });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: "",
    });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
module.exports = app;
