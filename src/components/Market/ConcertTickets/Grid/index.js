import React, { useState, useEffect } from "react";
import "./styles.css";
import { motion } from "framer-motion";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { saveItemToWatchlist } from "../../../../functions/saveItemToWatchlist";
import { removeItemToWatchlist } from "../../../../functions/removeItemToWatchlist";

function Grid({ ticket, delay }) {
  // Use ticket.id if available, otherwise fallback to ticket._id
  const ticketId = ticket.id || ticket._id;

  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const [isTicketAdded, setIsTicketAdded] = useState(
    watchlist.includes(ticketId)
  );

  // Debug: log and print ticket data
  useEffect(() => {
    console.log("Ticket object in Grid:", ticketId);
  }, [ticketId]);

  return (
    <a href={`/ticket/${ticketId}`}>
      <motion.div
        className="grid grid-ticket"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay }}
      >
        {/* Image on top */}
        <div className="ticket-image-container">
          <img
            src={ticket.artist_image}
            alt={ticket.artist}
            className="ticket-image"
          />
        </div>
        {/* Ticket Details */}
        <div className="ticket-info">
          <p className="ticket-title">{ticket.title}</p>
          <p className="ticket-artist">Artist: {ticket.artist}</p>
          <p className="ticket-venue">Venue: {ticket.venue}</p>
          <p className="ticket-date">
            Date: {new Date(ticket.date).toLocaleDateString()}
          </p>
          {ticket.price && (
            <p className="ticket-price">
              Price: ${parseFloat(ticket.price).toLocaleString()}
            </p>
          )}
        </div>
        {/* Watchlist Icon */}
        <div
          className="watchlist-icon"
          onClick={(e) => {
            e.preventDefault();
            if (isTicketAdded) {
              removeItemToWatchlist(e, ticketId, setIsTicketAdded);
            } else {
              setIsTicketAdded(true);
              saveItemToWatchlist(e, ticketId);
            }
          }}
        >
          {isTicketAdded ? <StarIcon /> : <StarOutlineIcon />}
        </div>
      </motion.div>
    </a>
  );
}

export default Grid;