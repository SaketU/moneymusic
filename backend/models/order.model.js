const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
   {
      stock: {
         type: String,
         required: true,
      },
      quantity: {
         // Number of units of the asset
         type: Number,
         required: true,
      },
      type: {
         // Type of the order
         type: String,
         enum: ["buy", "sell"],
         required: true,
      },
      price: {
         // Price per unit of the asset
         type: Number,
         required: true,
      },
      status: {
         // Status of the order
         type: String,
         enum: ["open", "partially_filled", "filled"],
         default: "open",
      },
      userId: {
         // Reference to the user making the order
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      createdAt: {
         // When the order was created
         type: Date,
         default: Date.now,
      },
   },
   { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
