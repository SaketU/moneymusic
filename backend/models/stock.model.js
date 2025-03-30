const { formGroupClasses } = require("@mui/material");
const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
   name: {
     type: String,
     required: formGroupClasses,
   },
   price: {
     type: Number,
     required: true,
     default: 0,
   },
 });

const Stock = mongoose.model("Stock", stockSchema);

module.exports = Stock;
