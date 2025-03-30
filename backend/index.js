require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utils/utilities");
const User = require("./models/user.model");
const validator = require("validator");

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

app.get("/artists", async (req, res) => {
   try {
      const artists = await Artist.find({});
      res.status(200).json(artists);
   } catch (error) {
      console.error("Error fetching artists:", error);
      res.status(500).json({ error: true, message: "Server error" });
   }
});

// Sign Up Route (Save user to the database)
app.post("/signup", async (req, res) => {
   console.log("POST /signup called"); // Log endpoint call
   const { fullName, email, username, password, confirmPassword } = req.body;

   // Validate required fields
   if (!fullName || !email || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please enter all fields" });
   }

   // Validate email format
   if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
   }

   // Ensure both password fields match
   if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
   }

   // Check if the email or username is already in use
   const existingUser = await User.findOne({ $or: [{ email }, { username }] });
   if (existingUser) {
      return res
         .status(400)
         .json({ message: "User already exists with that email or username" });
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

      // Generate a JWT token for the new user
      const accessToken = jwt.sign(
         { userId: user._id },
         process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: "72h" }
      );

      return res.status(200).json({
         error: false,
         message: "Account created successfully",
         user: {
            fullName: user.fullName,
            email: user.email,
            username: user.username,
         },
         accessToken,
      });
   } catch (error) {
      console.error("Error creating account:", error);
      return res.status(500).json({ message: "Server error" });
   }
});

app.post("/login", async (req, res) => {
   console.log("POST /login called"); // Log endpoint call
   const { email, password } = req.body;

   if (!email || !password) {
      return res
         .status(400)
         .json({ message: "Email and Password are requiured" });
   }

   const query = validator.isEmail(email)
      ? { email: email }
      : { username: email };

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

app.get("/get-user", authenticateToken, async (req, res) => {
   console.log("GET /get-user called"); // Log endpoint call
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
