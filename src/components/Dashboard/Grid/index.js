import React, { useState } from "react";
import "./styles.css";
import { motion } from "framer-motion";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { saveItemToWatchlist } from "../../../functions/saveItemToWatchlist";
import { removeItemToWatchlist } from "../../../functions/removeItemToWatchlist";

function Grid({ artist, delay }) {
  // Use localStorage watchlist (list of artist IDs)
  const watchlist = JSON.parse(localStorage.getItem("watchlist"));
  const [isArtistAdded, setIsArtistAdded] = useState(watchlist?.includes(artist._id));

  return (
    <a href={`/artist/${artist._id}`}>
      <motion.div
        className="grid"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
      >
        <div className="info-flex">
          <p className="artist-name">{artist.Artist}</p>
          <p className="artist-followers">
            Followers: {artist.Followers.toLocaleString()}
          </p>
        </div>
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
