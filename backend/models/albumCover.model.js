const mongoose = require('mongoose');

const albumCoverSchema = new mongoose.Schema({
  artist: { type: String, required: true },
  albumName: { type: String, required: true },
  albumImage: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
}, { versionKey: false });

module.exports = mongoose.model('AlbumCover', albumCoverSchema);