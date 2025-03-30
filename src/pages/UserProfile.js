import React, { useContext } from "react";
import { UserContext } from "../UserContext";
import Button from "../components/Common/Button";
import { motion } from "framer-motion";
import "./UserProfile.css"; // Updated CSS for dark/light mode

const UserProfile = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      {/* Profile Header */}
      <div className="user-info-section">
        <h1 className="user-info-title">{user.fullName}'s Profile</h1>
        <div className="user-info-card">
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
            <strong>Current Balance:</strong>{" "}
            ${user.balance ? user.balance.toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* Purchased Artists (Stocks) Section */}
      <div className="purchased-artists-section">
        <h2 className="section-title">Your Purchased Artists</h2>
        {user.stocks && user.stocks.length > 0 ? (
          <div className="grid-container">
            {user.stocks.map((stock, index) => (
              <motion.div
                key={index}
                className="grid-artist-card"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* <div className="grid-artist-image-container">
                  <img
                    src={stock.image || "/default-stock.png"}
                    alt={stock.name}
                    className="grid-artist-image"
                  />
                </div> */}
                <div className="grid-artist-info">
                  <p className="grid-artist-name">{stock.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="no-stocks-message">
            <p>You have not purchased any stocks.</p>
            <Button text="Explore Artists" onClick={() => window.location.href = "/dashboard"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
