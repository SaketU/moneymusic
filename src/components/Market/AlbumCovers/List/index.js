import React, { useState, useEffect } from "react";
import "./styles.css";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { saveItemToWatchlist } from "../../../../functions/saveItemToWatchlist";
import { removeItemToWatchlist } from "../../../../functions/removeItemToWatchlist";

function List({ album, delay }) {
  // Use album.id if available, otherwise fallback to album._id
  const albumId = album.id || album._id;

  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const [isAlbumAdded, setIsAlbumAdded] = useState(
    album ? watchlist.includes(albumId) : false
  );

  // If album is not defined, return null (after hooks have been called)
  if (!album) return null;

  return (
    <a href={`/album/${albumId}`}>
      <motion.tr
        className="list-row"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: delay }}
      >
        <Tooltip title="Album Cover">
          <td className="td-img">
            <img
              src={album.albumImage}
              alt={album.albumName}
              className="ticket-image-td" // you might rename this to album-image-td in CSS if desired
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </td>
        </Tooltip>
        <Tooltip title="Album Info" placement="bottom-start">
          <td className="td-info">
            <div className="info-flex">
              <p className="ticket-title td-p">Album: {album.albumName}</p>
              <p className="ticket-artist td-p">Artist: {album.artist}</p>
              <p className="ticket-date td-p">Year: {album.year}</p>
            </div>
          </td>
        </Tooltip>
        {album.price && (
          <Tooltip title="Price" placement="bottom-end">
            <td className="td-price">
              ${parseFloat(album.price).toFixed(2)}
            </td>
          </Tooltip>
        )}
        <td
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
        </td>
      </motion.tr>
    </a>
  );
}

export default List;
