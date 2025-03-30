import React, { useState, useEffect } from "react";
import "./styles.css";
import { motion } from "framer-motion";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { saveItemToWatchlist } from "../../../../functions/saveItemToWatchlist";
import { removeItemToWatchlist } from "../../../../functions/removeItemToWatchlist";
import BuyButton from "../../../BuyButton"; // Adjust path if necessary

function Grid({ album, delay }) {
  // Always call hooks by providing a safe fallback for album
  const safeAlbum = album || {};
  const albumId = safeAlbum.id || safeAlbum._id || ""; // fallback to empty string if not available

  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const [isAlbumAdded, setIsAlbumAdded] = useState(watchlist.includes(albumId));

  useEffect(() => {
    console.log("Album object in Grid:", albumId);
  }, [albumId]);

  // Only render content if a valid album is provided
  if (!album) return null;

  return (
    <a href={`/album/${albumId}`}>
      <motion.div
        className="grid grid-album"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
      >
        {/* Album Image */}
        <div className="album-image-container">
          <img
            src={album.albumImage}
            alt={album.albumName}
            className="album-image"
          />
        </div>
        {/* Album Details */}
        <div className="album-info">
          <p className="album-name">{album.albumName}</p>
          <p className="album-artist">Artist: {album.artist}</p>
          <p className="album-year">Year: {album.year}</p>
          {album.price && (
            <p className="album-price">
              Price: ${parseFloat(album.price).toLocaleString()}
            </p>
          )}
        </div>
        {/* Watchlist Icon */}
        <div
          className="watchlist-icon"
          onClick={(e) => {
            e.preventDefault();
            if (isAlbumAdded) {
              removeItemToWatchlist(e, albumId, setIsAlbumAdded);
            } else {
              setIsAlbumAdded(true);
              saveItemToWatchlist(e, albumId);
            }
          }}
        >
          {isAlbumAdded ? <StarIcon /> : <StarOutlineIcon />}
        </div>
        {/* Buy Button */}
        <div className="buy-button-container">
          <BuyButton item={album} type="album" />
        </div>
      </motion.div>
    </a>
  );
}

export default Grid;
