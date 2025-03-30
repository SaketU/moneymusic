require("dotenv").config();
const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("./models/user.model");
const validator = require("validator");
const Artist = require("./models/artist.model");
const cookieParser = require("cookie-parser");
const Ticket = require("./models/ticket.model");

mongoose
   .connect(config.connectionString)
   .then(() => console.log("Connected to MongoDB"))
   .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
   cors({
      origin: "http://localhost:3001",
      credentials: true, // Allows sending cookies and tokens
   })
);

// ------------------ Public Endpoints ------------------

const authenticateToken = (req, res, next) => {
   const token = req.cookies.token; // Read the token from the cookie

   if (!token) return res.sendStatus(401); // No token found, unauthorized

   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Invalid token, forbidden
      req.user = user; // Attach user data to request
      next();
   });
};
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
      return res
         .status(400)
         .json({ message: "User already exists with that email or username" });
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

      return res
         .status(200)
         .cookie("token", accessToken, {
            httpOnly: true,
            secure: false, // Set to true if using HTTPS
            sameSite: "lax", // Adjust this based on your needs
            maxAge: 72 * 60 * 60 * 1000, // 72 hours
         })
         .json({
            error: false,
            message: "Account created successfully",
            user: {
               fullName: user.fullName,
               email: user.email,
               username: user.username,
            },
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
      return res
         .status(400)
         .json({ message: "Email and Password are required" });
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

   return res
      .status(200)
      .cookie("token", accessToken, {
         httpOnly: true,
         secure: false, // Set to true if using HTTPS
         sameSite: "lax",
         maxAge: 72 * 60 * 60 * 1000, // 72 hours
      })
      .json({
         error: false,
         message: "Login Successful",
         user: { fullName: user.fullName, email: user.email },
      });
});
// Logout Route
app.post("/logout", (req, res) => {
   res.clearCookie("token", {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      sameSite: "lax",
   });
   return res.status(200).json({ message: "Logout successful" });
});

// ------------------ Protected Endpoints ------------------

// Get user details (Protected)

app.get("/get-user", authenticateToken, async (req, res) => {
   try {
      const user = await User.findById(req.user.userId);
      if (!user) return res.sendStatus(404);

      res.status(200).json({ message: "Authenticated", user });
   } catch (error) {
      res.status(500).json({ message: "Server error" });
   }
});
app.get("/artist/:id", authenticateToken, async (req, res) => {
  try {
    console.log("HERE")
    const artist = await Artist.findById(req.params.id);
    console.log(artist)
    if (!artist) {
      return res.status(404).json({ error: true, message: "Artist not found" });
    }
    res.status(200).json(artist);
  } catch (error) {
    console.error("Error fetching artist:", error.message);
    res.status(500).json({ error: true, message: "Server error" });
  }
});
// Get all artists (Protected)
app.get("/artists", async (req, res) => {
   try {
      const artists = await Artist.find({});
      res.status(200).json(artists);
   } catch (error) {
      console.error("Error fetching artists:", error);
      res.status(500).json({ error: true, message: "Server error" });
   }
});

app.get("/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find({});
    res.status(200).json(tickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ error: true, message: "Server error" });
  }
});



app.listen(8000, () => {
});

module.exports = app;
