import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { UserContext } from "../UserContext";
import Button from "../components/Common/Button";
import "./UserProfile.css"; // Ensure this file contains your grid styles and user info styling

// Grid view component for a single artist (purchased stock)
function GridArtist({ artist, delay }) {
  return (
    <motion.div
      className="grid grid-artist"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <div className="artist-image-container">
        <img
          src={artist.artist_image || "/default-stock.png"}
          alt={artist.Artist || artist.name}
          className="artist-image"
        />
      </div>
      <div className="artist-info">
        <p className="artist-name">{artist.Artist || artist.name}</p>
        {artist.stock_price && (
          <p className="artist-price">
            Price: ${parseFloat(artist.stock_price).toFixed(2)}
          </p>
        )}
      </div>
    </motion.div>
  );
}

const UserProfile = () => {
  const { user } = useContext(UserContext);
  // State to store the detailed artist objects for purchased stocks.
  const [purchasedArtists, setPurchasedArtists] = useState([]);

  // Log user info upon initialization
  useEffect(() => {
    if (user) {
      console.log("User Information:", user);
    }
  }, [user]);

  // Fetch the full artist details from the backend using the stock IDs in user.stocks
  useEffect(() => {
    async function fetchPurchasedArtists() {
      if (user && user.stocks && user.stocks.length > 0) {
        try {
          // For each stock in user.stocks, fetch its artist details from /artist/:id
          const artistPromises = user.stocks.map(async (stockItem) => {
            const response = await fetch(
              `/artist/${encodeURIComponent(stockItem.id)}`
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch artist for ID ${stockItem.id}`);
            }
            const data = await response.json();
            return data;
          });
          const artists = await Promise.all(artistPromises);
          setPurchasedArtists(artists);
        } catch (error) {
          console.error("Error fetching purchased artists:", error);
        }
      }
    }
    fetchPurchasedArtists();
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* User Information Section */}
      <div className="grey-wrapper user-details" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <h2>User Information</h2>
        <p>
          <strong>Full Name:</strong> {user.fullName}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Current Balance:</strong> ${user.balance ? user.balance.toFixed(2) : "0.00"}
        </p>
      </div>

      {/* Purchased Artists (Stocks) Section in Grid Format */}
      <div className="grey-wrapper" style={{ padding: "1rem" }}>
        <h2>Your Purchased Artists</h2>
        {purchasedArtists && purchasedArtists.length > 0 ? (
          <div className="grid-container">
            {purchasedArtists.map((artist, index) => (
              <GridArtist key={index} artist={artist} delay={index * 0.1} />
            ))}
          </div>
        ) : (
          <p>You have not purchased any stocks.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
