const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const artistSchema = new Schema({
  Artist: { type: String, required: true },
  Followers: { type: Number },
  // Include other fields as needed; for example monthly data can be stored as an object:
  monthlyData: { type: mongoose.Schema.Types.Mixed }
}, { 
  timestamps: true,
  collection: "ArtistsInfo" // This ensures Mongoose uses the "ArtistsInfo" collection
});

module.exports = mongoose.model('Artist', artistSchema);
