// seedMarketplaceItems.js
require("dotenv").config();
const mongoose = require("mongoose");
const config = require("./config.json"); // Ensure this contains your connection string
const MarketplaceItem = require("./models/ticket.model");

// Hardcoded marketplace items with prices as whole dollars between 5000 and 20000
const items = [
        {
          id: "1",
          artist: "Arijit Singh",
          title: "Arijit Singh Concert",
          venue: "Madison Square Garden",
          date: new Date("2025-06-01T20:00:00Z"),
          price: 15000,
          artist_image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoJZlPY4Ux1enP3ZrbHkcqQfuZSk7zo5BkyA&s"
        },
        {
          id: "2",
          artist: "Taylor Swift",
          title: "Taylor Swift Concert",
          venue: "Wembley Stadium",
          date: new Date("2025-07-01T20:00:00Z"),
          price: 17000,
          artist_image: "https://heights-photos.s3.amazonaws.com/wp-content/uploads/2023/10/22124447/taylor-swift-eras-tour-081023-3-3411bb8115944906a22fa9d1b7239d13-1145x628.jpg"
        },
        {
          id: "3",
          artist: "Ed Sheeran",
          title: "Ed Sheeran Concert",
          venue: "Staples Center",
          date: new Date("2025-08-01T20:00:00Z"),
          price: 16000,
          artist_image: "https://www.rollingstone.com/wp-content/uploads/2024/05/ed-sheeran-1.jpg?w=1581&h=1054&crop=1"
        },
        {
          id: "4",
          artist: "Bruno Mars",
          title: "Bruno Mars Concert",
          venue: "The O2 Arena",
          date: new Date("2025-09-01T20:00:00Z"),
          price: 13000,
          artist_image: "https://variety.com/wp-content/uploads/2024/08/Q5A6866-5.jpg?w=1000&h=667&crop=1"
        },
        {
          id: "5",
          artist: "Lady Gaga",
          title: "Lady Gaga Concert",
          venue: "Los Angeles Memorial Coliseum",
          date: new Date("2025-10-01T20:00:00Z"),
          price: 12000,
          artist_image: "https://arc-anglerfish-arc2-prod-bostonglobe.s3.amazonaws.com/public/SRU7KGLWI77IVHL5YV4BISGUIM.jpg"
        },
];

const mongoURI = config.connectionString; // For example, "mongodb://localhost:27017/concerts"

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    return MarketplaceItem.insertMany(items);
  })
  .then((docs) => {
    console.log("Inserted documents:", docs);
    return mongoose.connection.close();
  })
  .then(() => {
    console.log("Database connection closed");
  })
  .catch((err) => {
    console.error("Error:", err);
  });
