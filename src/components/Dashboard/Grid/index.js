import React, { useState } from "react";
import "./styles.css";
import { motion } from "framer-motion";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { saveItemToWatchlist } from "../../../functions/saveItemToWatchlist";
import { removeItemToWatchlist } from "../../../functions/removeItemToWatchlist";

function Grid({ artist, delay }) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist"));
  const [isArtistAdded, setIsArtistAdded] = useState(
    watchlist?.includes(artist._id)
  );

  return (
    <a href={`/artist/${artist._id}`}>
      <motion.div
        className="grid grid-artist"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
      >
        {/* Image on top */}
        <div className="artist-image-container">
          <img
            src={artist.artist_image}
            alt={artist.Artist}
            className="artist-image"
          />
        </div>
        {/* Artist Details */}
        <div className="artist-info">
          <p className="artist-name">{artist.Artist}</p>
          {artist.stock_price && (
            <p className="artist-price">
              Price: ${parseFloat(artist.stock_price).toLocaleString()}
            </p>
          )}
          <p className="artist-followers">
            Followers: {artist.Followers?.toLocaleString() || "N/A"}
          </p>
          <p className="artist-listeners">
            Monthly Listeners:{" "}
            {artist.monthlyListeners?.toLocaleString() || "N/A"}
          </p>
        </div>
        {/* Watchlist Icon */}
        <div
          className="watchlist-icon"
          onClick={(e) => {
            e.preventDefault();
            if (isArtistAdded) {
              removeItemToWatchlist(e, artist._id, setIsArtistAdded);
            } else {
              setIsArtistAdded(true);
              saveItemToWatchlist(e, artist._id);
            }
          }}
        >
          {isArtistAdded ? <StarIcon /> : <StarOutlineIcon />}
        </div>
      </motion.div>
    </a>
  );
}

export default Grid;
