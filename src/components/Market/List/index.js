import React, { useState, useEffect } from "react";
import "./styles.css";
import { motion } from "framer-motion";
import { Tooltip } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import { saveItemToWatchlist } from "../../../functions/saveItemToWatchlist";
import { removeItemToWatchlist } from "../../../functions/removeItemToWatchlist";

function List({ ticket, delay }) {
  // Use ticket.id if available, otherwise fallback to ticket._id
  const ticketId = ticket.id || ticket._id;

  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const [isTicketAdded, setIsTicketAdded] = useState(
    ticket ? watchlist.includes(ticketId) : false
  );

  // If ticket is not defined, return null (after hooks have been called)
  if (!ticket) return null;

  return (
    <a href={`/ticket/${ticketId}`}>
      <motion.tr
        className="list-row"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: delay }}
      >
        <Tooltip title="Ticket Image">
          <td className="td-img">
            <img
              src={ticket.artist_image}
              alt={ticket.artist}
              className="ticket-image-td"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </td>
        </Tooltip>
        <Tooltip title="Ticket Info" placement="bottom-start">
          <td className="td-info">
            <div className="info-flex">
              <p className="ticket-artist td-p">Artist: {ticket.artist}</p>
              <p className="ticket-title td-p">Title: {ticket.title}</p>
              <p className="ticket-venue td-p">Venue: {ticket.venue}</p>
              <p className="ticket-date td-p">
                Date: {new Date(ticket.date).toLocaleDateString()}
              </p>
            </div>
          </td>
        </Tooltip>
        {ticket.price && (
          <Tooltip title="Ticket Price" placement="bottom-end">
            <td className="td-price">
              ${parseFloat(ticket.price).toFixed(2)}
            </td>
          </Tooltip>
        )}
        <td
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
        </td>
      </motion.tr>
    </a>
  );
}

export default List;
