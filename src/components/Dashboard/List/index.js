import React, { useState } from "react";
import "./styles.css";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { saveItemToWatchlist } from "../../../functions/saveItemToWatchlist";
import { removeItemToWatchlist } from "../../../functions/removeItemToWatchlist";

function List({ artist, delay }) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist"));
  const [isArtistAdded, setIsArtistAdded] = useState(watchlist?.includes(artist._id));

  return (
    <a href={`/artist/${artist._id}`}>
      <motion.tr
        className="list-row"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: delay }}
      >
        <Tooltip title="Artist Name">
          <td className="td-info">
            <div className="info-flex">
              <p className="artist-name td-p">{artist.Artist}</p>
            </div>
          </td>
        </Tooltip>
        <Tooltip title="Total Followers">
          <td className="td-followers">
            {artist.Followers.toLocaleString()}
          </td>
        </Tooltip>
        {/* Additional columns (like monthly data) can be added here */}
        <td
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
        </td>
      </motion.tr>
    </a>
  );
}

export default List;
