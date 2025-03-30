const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artistSchema = new Schema({
  Artist: { type: String, required: true },
  Followers: { type: Number },
  monthlyData: { type: mongoose.Schema.Types.Mixed }
}, { 
  timestamps: true,
  collection: "ArtistsInfo" // Ensures the model uses the "ArtistsInfo" collection
});

module.exports = mongoose.model("Artist", artistSchema);
