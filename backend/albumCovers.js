// seedAlbums.js
const mongoose = require('mongoose');
const AlbumCover = require('./models/albumCover.model'); // Your album cover model
const config = require('./config.json'); // Assumes connectionString is stored here

// Sample album cover data with albumName and price
const albums = [
  {
    artist: "The Beatles",
    albumName: "Abbey Road",
    albumImage:
      "https://www.billboard.com/wp-content/uploads/2022/03/2.-The-Beatles-%E2%80%98Abbey-Road-1969-album-art-billboard-1240.jpg?w=1024",
    year: 1969,
    price: 4999.99,
  },
  {
    artist: "Drake",
    albumName: "Take Care",
    albumImage: "https://www.levelman.com/content/images/size/w1000/2022/11/take-care.jpg",
    year: 2011,
    price: 3845.99,
  },
  {
    artist: "Elvis Presley",
    albumName: "Elvis Presley",
    albumImage:
      "https://www.billboard.com/wp-content/uploads/2022/03/10.-Elvis-Presley-%E2%80%98Elvis-Presley-1956-album-art-billboard-1240.jpg?w=1140",
    year: 1956,
    price: 3010.99,
  },
  {
    artist: "Michael Jackson",
    albumName: "Thriller",
    albumImage:
      "https://cdn-p.smehost.net/sites/28d35d54a3c64e2b851790a18a1c4c18/wp-content/uploads/2016/03/MJThriller25PRESSresize.jpg",
    year: 1982,
    price: 5999.99,
  },
  {
    artist: "Travis Scott",
    albumName: "Utopia",
    albumImage:
      "https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa51d5744-77d5-4de8-9f84-eded386804df_1440x1440.jpeg",
    year: 2023,
    price: 4599.99,
  }
];

mongoose
  .connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    return AlbumCover.insertMany(albums);
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
