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
const http = require("http");
const { Server } = require("socket.io");
const Order = require("./models/order.model");
const Stock = require("./models/stock.model");
const Trade = require("./models/trade.model");

mongoose
   .connect(config.connectionString)
   .then(async () => {
      console.log("Connected to MongoDB");

      // ✅ Create the Market account if it doesn't exist
      await createMarketAccount();

      // ✅ Seed the Market account with initial stocks
      await seedMarketStocks();

      console.log("Market setup completed.");
   })
   .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
   cors: {
      origin: "http://localhost:3000",
      credentials: true,
   },
});
app.use(cookieParser());
app.use(express.json());
app.use(
   cors({
      origin: "http://localhost:3000",
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

const createMarketAccount = async () => {
   const marketUser = await User.findOne({ username: "Market" });

   if (!marketUser) {
      const market = new User({
         fullName: "Market",
         username: "Market",
         email: "market@stocks.com",
         password: await bcrypt.hash("marketpassword", 10), // Prevent login with a random password
         balance: 1000000, // Infinite money for simplicity
      });

      await market.save();
      console.log("Market account created.");
   }
};

const seedMarketStocks = async () => {
   const marketUser = await User.findOne({ username: "Market" });

   if (!marketUser) {
      console.error("Market user not found.");
      return;
   }

   const initialStocks = [
      { name: "Taylor Swift", price: 100 },
      { name: "Drake", price: 80 },
      { name: "Beyoncé", price: 120 },
      { name: "Kanye West", price: 90 },
      { name: "Adele", price: 110 },
   ];

   for (const stockData of initialStocks) {
      for (let i = 0; i < 10; i++) {
         // Create 10 stocks of each artist
         const newStock = new Stock({
            name: stockData.name,
            price: stockData.price,
         });
         await newStock.save();
         console.log(
            `Created stock: ${stockData.name} with ID ${newStock._id}`
         );

         // Add the newly created stock to the Market user's portfolio
         // Storing both the stock ID and name
         marketUser.stocks.push({ stockId: newStock._id, name: newStock.name });
      }
   }

   await marketUser.save();
   console.log("Market account seeded with initial stocks.");
};

const { Heap } = require("heap-js");

const buyOrders = {}; // Max-Heap (Highest price first)
const sellOrders = {}; // Min-Heap (Lowest price first)

const getBuyHeap = (stock) => {
   if (!buyOrders[stock]) {
      buyOrders[stock] = new Heap((a, b) => b.price - a.price);
   }
   return buyOrders[stock];
};

const getSellHeap = (stock) => {
   if (!sellOrders[stock]) {
      sellOrders[stock] = new Heap((a, b) => a.price - b.price);
   }
   return sellOrders[stock];
};

const matchOrders = async (newOrder) => {
   const { stock, type, quantity, price, userId } = newOrder;
   const oppositeHeap = type === "buy" ? getSellHeap(stock) : getBuyHeap(stock);
   const matchedTrades = [];
   let remainingQuantity = quantity;
   let lastMatchedPrice = price; // Store the last matched price to update Artist price

   while (!oppositeHeap.isEmpty() && remainingQuantity > 0) {
      const topOrder = oppositeHeap.peek();
      const priceCondition =
         type === "buy" ? price >= topOrder.price : price <= topOrder.price;

      if (!priceCondition) break;

      const matchedQuantity = Math.min(remainingQuantity, topOrder.quantity);
      remainingQuantity -= matchedQuantity;
      topOrder.quantity -= matchedQuantity;

      const buyerId = type === "buy" ? userId : topOrder.userId;
      const sellerId = type === "sell" ? userId : topOrder.userId;

      const trade = new Trade({
         stock,
         quantity: matchedQuantity,
         buyOrderId: type === "buy" ? newOrder._id : topOrder._id,
         sellOrderId: type === "sell" ? newOrder._id : topOrder._id,
         buyerId,
         sellerId,
         price,
      });

      try {
         await trade.save(); // Save the trade
         matchedTrades.push(trade);
         console.log(`Trade successfully created: ${trade._id}`);
         io.emit("newTrade", trade);
      } catch (error) {
         console.error("Error saving trade:", error);
      }

      const seller = await User.findById(sellerId);
      const buyer = await User.findById(buyerId);

      if (type === "buy") {
         // For a buy order, add stocks to the buyer's portfolio
         for (let i = 0; i < matchedQuantity; i++) {
            const newStock = new Stock({ name: stock, price: price });
            await newStock.save();
            buyer.stocks.push({ stockId: newStock._id, name: newStock.name });
         }
         await buyer.save();
      }

      if (type === "sell") {
         // For a sell order, credit the seller's balance
         const revenue = matchedQuantity * price;
         seller.balance += revenue;
         await seller.save();
      }

      if (topOrder.quantity <= 0) oppositeHeap.pop();

      // Update last matched price for the stock
      lastMatchedPrice = price;
   }

   if (lastMatchedPrice) {
      try {
         // Update the artist's price by matching based on the artist's name
         await Artist.findOneAndUpdate(
            { name: stock }, // Assumes the artist schema uses "name"
            { $set: { price: lastMatchedPrice } },
            { upsert: true, new: true, strict: false }
         );
         io.emit("priceUpdate", { stock, price: lastMatchedPrice });
         console.log(
            `Updated artist price for ${stock} to ${lastMatchedPrice}`
         );
      } catch (error) {
         console.error("Error updating artist price:", error);
      }
   }

   if (remainingQuantity > 0) {
      const orderData = {
         ...newOrder._doc,
         quantity: remainingQuantity,
         status: "open",
      };
      if (type === "buy") getBuyHeap(stock).push(orderData);
      else getSellHeap(stock).push(orderData);
   }

   await newOrder.save();
   return matchedTrades;
};

io.on("connection", (socket) => {
   console.log("New client connected:", socket.id);

   socket.on("placeOrder", async (orderData) => {
      console.log("Received Order:", orderData);

      try {
         const { stock, type, quantity, price, userId } = orderData;

         if (!userId) {
            return socket.emit("orderError", {
               message: "User ID is required.",
            });
         }

         const user = await User.findById(userId);
         if (!user) {
            return socket.emit("orderError", { message: "User not found." });
         }

         const totalCost = quantity * price;

         if (type === "buy") {
            console.log(`Processing BUY order for ${stock}...`);

            if (user.balance < totalCost) {
               return socket.emit("orderError", {
                  message: "Insufficient balance.",
               });
            }

            // Deduct user's balance for buy order
            user.balance -= totalCost;
            await user.save();

            const newOrder = new Order({
               stock,
               type,
               quantity,
               price,
               userId,
               status: "open",
            });
            await newOrder.save();
            console.log("New buy order saved:", newOrder);

            getBuyHeap(stock).push({
               _id: newOrder._id,
               stock,
               type,
               quantity,
               price,
               userId,
            });

            for (let i = 0; i < quantity; i++) {
               const newStock = new Stock({ name: stock, price: price });
               await newStock.save();
               user.stocks.push({ stockId: newStock._id, name: newStock.name });
            }
            await user.save();

            socket.emit("orderPlaced", {
               success: true,
               message: "Buy order placed successfully.",
            });

            // Trigger order matching logic
            const trades = await matchOrders(newOrder);
            if (trades.length > 0) {
               io.emit("tradesMatched", trades);
            }
         }

         if (type === "sell") {
            console.log(`Processing SELL order for ${stock}...`);
            // Check if the user owns enough stocks to sell by matching the stock name
            const userStocks = user.stocks.filter(
               (stockItem) => stockItem.name === stock
            );
            if (userStocks.length < quantity) {
               return socket.emit("orderError", {
                  message: "Insufficient stocks to sell.",
               });
            }
            // Remove the specified quantity of stocks from the user's portfolio
            const updatedStocks = [];
            let removedCount = 0;
            for (const stockItem of user.stocks) {
               if (stockItem.name === stock && removedCount < quantity) {
                  removedCount++;
               } else {
                  updatedStocks.push(stockItem);
               }
            }
            user.stocks = updatedStocks;
            await user.save();

            // Credit the user's balance with the revenue from the sale
            const revenue = price * quantity;
            user.balance += revenue;
            await user.save();
            console.log(
               `Sell order processed. User credited with $${revenue}.`
            );

            socket.emit("orderPlaced", {
               success: true,
               message: "Sell order processed successfully.",
               newBalance: user.balance,
            });

            // Optionally, save the trade for the sell order
            const trade = new Trade({
               stock,
               quantity,
               buyOrderId: null,
               sellOrderId: null,
               buyerId: null,
               sellerId: userId,
               price,
            });
            await trade.save();
            io.emit("newTrade", trade);
         }
      } catch (error) {
         console.error("Error processing order:", error);
         socket.emit("orderError", { message: "Error processing order." });
      }
   });

   socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
   });
});

// ------------------ Auth Routes ------------------

// Sign Up Route
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
      return res.status(400).json({
         message: "User already exists with that email or username",
      });
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

// Get a specific artist (Protected)
app.get("/artist/:id", authenticateToken, async (req, res) => {
   try {
      console.log("Fetching artist with ID:", req.params.id);
      const artist = await Artist.findById(req.params.id);
      if (!artist) {
         return res
            .status(404)
            .json({ error: true, message: "Artist not found" });
      }
      res.status(200).json(artist);
   } catch (error) {
      console.error("Error fetching artist:", error.message);
      res.status(500).json({ error: true, message: "Server error" });
   }
});

// Get all artists (Public)
app.get("/artists", async (req, res) => {
   try {
      const artists = await Artist.find({});
      res.status(200).json(artists);
   } catch (error) {
      console.error("Error fetching artists:", error);
      res.status(500).json({ error: true, message: "Server error" });
   }
});

// Get all tickets (Public)
app.get("/tickets", async (req, res) => {
   try {
      const tickets = await Ticket.find({});
      res.status(200).json(tickets);
   } catch (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: true, message: "Server error" });
   }
});

server.listen(8000, () => console.log("Server running on port 8000"));
module.exports = app;
