import React, { useState, useEffect } from "react";
import "./styles.css";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { saveItemToWatchlist } from "../../../functions/saveItemToWatchlist";
import { removeItemToWatchlist } from "../../../functions/removeItemToWatchlist";

function List({ artist, delay }) {
  // Always call hooks unconditionally.
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const [isArtistAdded, setIsArtistAdded] = useState(artist ? watchlist.includes(artist._id) : false);

  // If artist is not defined, return null (after hooks have been called).
  if (!artist) return null;

  return (
    <a href={`/artist/${artist._id}`}>
      <motion.tr
        className="list-row"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: delay }}
      >
        <Tooltip title="Artist Image">
          <td className="td-img">
            <img
              src={artist.artist_image}
              alt={artist.Artist}
              className="artist-image-td"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </td>
        </Tooltip>
        <Tooltip title="Artist Info" placement="bottom-start">
          <td className="td-info">
            <div className="info-flex">
              <p className="artist-name td-p">{artist.Artist}</p>
              <p className="artist-followers td-p">
                Followers: {artist.Followers.toLocaleString()}
              </p>
            </div>
          </td>
        </Tooltip>
        {artist.stock_price && (
          <Tooltip title="Stock Price" placement="bottom-end">
            <td className="td-stock">
              ${parseFloat(artist.stock_price).toFixed(2)}
            </td>
          </Tooltip>
        )}
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
