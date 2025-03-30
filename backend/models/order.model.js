const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
   stock: { type: String, required: true },
   quantity: { type: Number, required: true },
   type: { type: String, enum: ["buy", "sell"], required: true },
   price: { type: Number, required: true },
   status: {
      type: String,
      enum: ["open", "partially_filled", "filled"],
      default: "open",
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
