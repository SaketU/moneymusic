const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User schema
const userSchema = new Schema(
   {
      fullName: { type: String, required: true },
      username: { type: String, unique: true, sparse: true },
      email: { type: String, unique: true, required: true },
      password: { type: String, required: true }, // Password should be required if signing up
      createdOn: { type: Date, default: Date.now },
      balance: { type: Number, default: 1000 },
      stocks: [
         {
            stockId: {
               type: Schema.Types.ObjectId,
               ref: "Stock",
               required: true,
            },
         },
      ],
   },
   { collection: "Users" }
);

module.exports = mongoose.model("User", userSchema);
