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
      let stock = await Stock.findOne({ name: stockData.name });

      if (!stock) {
         stock = new Stock(stockData);
         await stock.save();
      }

      // Add 10 stocks of each artist to the Market's portfolio
      const userStock = marketUser.stocks.find(
         (stockItem) => stockItem.stockId.toString() === stock._id.toString()
      );

      if (!userStock) {
         marketUser.stocks.push({ stockId: stock._id, quantity: 10 });
      } else {
         userStock.quantity = 10; // Reset to 10 if already exists
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

      await trade.save();
      matchedTrades.push(trade);

      io.emit("newTrade", trade);

      const seller = await User.findById(sellerId);
      const buyer = await User.findById(buyerId);

      if (type === "buy") {
         // ✅ Create a new Stock entry for each portion of the matched trade
         const newStock = new Stock({ name: stock, price: price });
         await newStock.save();

         // ✅ Add the new stock to the buyer's portfolio
         buyer.stocks.push({
            stockId: newStock._id,
            quantity: matchedQuantity,
         });
         await buyer.save();
      }

      if (type === "sell") {
         const revenue = matchedQuantity * price;
         seller.balance += revenue;
         await seller.save();
      }

      if (topOrder.quantity <= 0) oppositeHeap.pop();
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
      try {
         const { stock, type, quantity, price, userId } = orderData;

         if (!userId) {
            return socket.emit("orderError", {
               message: "User ID is required.",
            });
         }

         const user = await User.findById(userId);
         if (!user)
            return socket.emit("orderError", { message: "User not found." });

         const totalCost = quantity * price;

         // ✅ Handle Buy Orders
         if (type === "buy") {
            if (user.balance < totalCost) {
               return socket.emit("orderError", {
                  message: "Insufficient balance.",
               });
            }

            // 🔍 Check if ANY USER other than the Market has the stock available to sell
            const otherUsersWithStock = await User.find({
               _id: { $ne: userId }, // Exclude the buyer themselves
               stocks: {
                  $elemMatch: {
                     stockId: stock,
                     quantity: { $gte: quantity },
                  },
               },
            });

            if (otherUsersWithStock.length > 0) {
               // ✅ Other users have the stock - Proceed with matching logic (normal flow)
               console.log("Matching with other users...");
            } else {
               // ❌ No other users have the stock - Check the Market account
               const marketUser = await User.findOne({ username: "Market" });

               if (!marketUser) {
                  return socket.emit("orderError", {
                     message: "Market account not found.",
                  });
               }

               const marketStock = marketUser.stocks.find(
                  (stockItem) =>
                     stockItem.stockId.toString() === stock.toString()
               );

               if (marketStock && marketStock.quantity >= quantity) {
                  // Process the purchase directly with the Market account
                  marketStock.quantity -= quantity;
                  await marketUser.save();

                  // ✅ Create a new Stock entry for the buyer
                  const newStock = new Stock({ name: stock, price: price });
                  await newStock.save();

                  user.stocks.push({
                     stockId: newStock._id,
                     quantity: quantity,
                  });

                  user.balance -= totalCost;
                  await user.save();

                  // ✅ Create a Trade entry for the transaction
                  const newTrade = new Trade({
                     stock,
                     quantity,
                     buyOrderId: null,
                     sellOrderId: null,
                     buyerId: user._id,
                     sellerId: marketUser._id,
                     price: price,
                  });

                  await newTrade.save();

                  // ✅ Emit the new price to all connected clients
                  io.emit("priceUpdate", {
                     stock,
                     price,
                  });

                  socket.emit("orderPlaced", {
                     success: true,
                     message: "Order successfully placed from Market!",
                     newBalance: user.balance,
                  });

                  return; // Return early since the order was handled by the Market account
               } else {
                  return socket.emit("orderError", {
                     message: "Stock not available in Market.",
                  });
               }
            }
         }

         // ✅ Handle Sell Orders (No Balance Adjustment Here)
         if (type === "sell") {
            const userStock = user.stocks.find(
               (stockItem) => stockItem.stockId.toString() === stock.toString()
            );

            if (!userStock || userStock.quantity < quantity) {
               return socket.emit("orderError", {
                  message: "Insufficient stock to sell.",
               });
            }

            userStock.quantity -= quantity;

            if (userStock.quantity === 0) {
               user.stocks = user.stocks.filter(
                  (stockItem) =>
                     stockItem.stockId.toString() !== stock.toString()
               );
            }

            await user.save();
         }

         // Save the order as usual
         const newOrder = new Order(orderData);
         await newOrder.save();

         // Process the order with matching logic
         const trades = await matchOrders(newOrder);

         if (trades.length > 0) {
            const lastTradePrice = trades[trades.length - 1].price;

            io.emit("priceUpdate", {
               stock: newOrder.stock,
               price: lastTradePrice,
            });

            if (type === "sell") {
               const revenue = quantity * lastTradePrice;
               user.balance += revenue;
               await user.save();

               socket.emit("orderPlaced", {
                  success: true,
                  message: "Order successfully placed!",
                  newBalance: user.balance,
               });
            }
         } else {
            if (type === "buy") {
               socket.emit("orderPlaced", {
                  success: true,
                  message: "Order successfully placed!",
                  newBalance: user.balance,
               });
            }
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
      console.log("HERE");
      const artist = await Artist.findById(req.params.id);
      console.log(artist);
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

server.listen(8000, () => console.log("Server running on port 8000"));
module.exports = app;
