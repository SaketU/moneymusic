const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  id: { type: String, required: true },
  artist: { type: String, required: true },
  title: { type: String, required: true },
  venue: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: String, required: true },
  artist_image: { type: String },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
