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
const Artist = require("./models/artist.model");

mongoose.connect(config.connectionString)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));

// ------------------ Public Endpoints ------------------

// Sign Up Route (Save user to the database)
app.post("/signup", async (req, res) => {
   console.log("POST /signup called");
   const { fullName, email, username, password, confirmPassword } = req.body;

   if (!fullName || !email || !username || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please enter all fields" });
   }

   if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
   }

   if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
   }

   const existingUser = await User.findOne({ $or: [{ email }, { username }] });
   if (existingUser) {
      return res.status(400).json({ message: "User already exists with that email or username" });
   }

   try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
         fullName,
         email,
         username,
         password: hashedPassword,
      });

      await user.save();

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
      return res.status(500).json({ message: "Server error" });
   }
});

// Login Route
app.post("/login", async (req, res) => {
   console.log("POST /login called");
   const { email, password } = req.body;

   if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
   }

   const query = validator.isEmail(email) ? { email } : { username: email };
   const user = await User.findOne(query);
   if (!user) {
      return res.status(400).json({ message: "User not found" });
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Password" });
   }

   const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
   );

   return res.json({
      error: false,
      message: "Login Successful",
      user: { fullName: user.fullName, email: user.email },
      accessToken,
   });
});

// ------------------ Protected Endpoints ------------------

// Get user details (Protected)
app.get("/get-user", authenticateToken, async (req, res) => {
   console.log("GET /get-user called");
   const { userId } = req.user;
   const isUser = await User.findOne({ _id: userId });
   if (!isUser) {
      return res.sendStatus(401);
   }
   return res.json({ user: isUser, message: "" });
});

// Get all artists (Protected)
app.get("/artists", authenticateToken, async (req, res) => {
   try {
      const artists = await Artist.find({});
      res.status(200).json(artists);
   } catch (error) {
      console.error("Error fetching artists:", error);
      res.status(500).json({ error: true, message: "Server error" });
   }
});

app.listen(8000, () => {
   console.log("Server is running on port 8000");
});

module.exports = app;
