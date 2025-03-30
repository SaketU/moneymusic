const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema(
   {
      stock: {
         // The stock symbol
         type: String,
         required: true,
      },
      quantity: {
         // Number of units traded
         type: Number,
         required: true,
      },
      buyOrderId: {
         // The buy order that initiated this trade
         type: mongoose.Schema.Types.ObjectId,
         ref: "Order",
         required: true,
      },
      sellOrderId: {
         // The sell order that matched this trade
         type: mongoose.Schema.Types.ObjectId,
         ref: "Order",
         required: true,
      },
      buyerId: {
         // The user who placed the buy order
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      sellerId: {
         // The user who placed the sell order
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      timestamp: {
         // When the trade occurred
         type: Date,
         default: Date.now,
      },
   },
   { timestamps: true }
);

const Trade = mongoose.model("Trade", tradeSchema);

module.exports = Trade;
