import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import axios from "axios";
import { UserContext } from "../../../UserContext";
import "./styles.css";

// Initialize WebSocket connection
const socket = io("http://localhost:8000", { withCredentials: true });

const BuySell = ({ userID, stockName, stockPrice, onTransactionComplete }) => {
  const [action, setAction] = useState("buy");
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentPrice, setCurrentPrice] = useState(stockPrice);
  const [userPrice, setUserPrice] = useState(stockPrice);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    socket.on("priceUpdate", (data) => {
      if (data.stock === stockName) {
        setCurrentPrice(data.price);
      }
    });

    socket.on("orderPlaced", async (data) => {
      if (data.success) {
        setSuccessMessage(`${action} successful!`);
        setQuantity(0);

        if (onTransactionComplete) onTransactionComplete();

        // Fetch updated user data
        await fetchUpdatedUser();
      } else {
        setError(data.message || "Transaction failed.");
      }
    });

    socket.on("newTrade", async (trade) => {
      console.log("New Trade Occurred:", trade);
      if (trade.buyerId === user._id || trade.sellerId === user._id) {
        if (trade.buyerId === user._id) {
          alert("Stock purchased successfully and added to your account.");
        }
        if (trade.sellerId === user._id) {
          alert("Stock sold successfully and your balance has been updated.");
        }
        // Fetch updated user data
        await fetchUpdatedUser();
      }
    });

    return () => {
      socket.off("priceUpdate");
      socket.off("orderPlaced");
      socket.off("newTrade");
    };
  }, [stockName, user, action]);

  const fetchUpdatedUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get-user", {
        withCredentials: true,
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching updated user data:", error);
    }
  };

  const handleActionChange = (event) => {
    setAction(event.target.value.toLowerCase());
    setError("");
    setSuccessMessage("");
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
    setError("");
    setSuccessMessage("");
  };

  const handlePriceChange = (event) => {
    setUserPrice(event.target.value);
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (quantity <= 0) {
      setError("Quantity must be greater than zero.");
      return;
    }

    if (userPrice <= 0) {
      setError("Price must be greater than zero.");
      return;
    }

    const orderData = {
      stock: stockName,
      type: action,
      quantity: parseInt(quantity),
      price: parseFloat(userPrice),
      userId: user._id,
    };

    socket.emit("placeOrder", orderData);
  };

  return (
    <div className="buy-sell-container">
      <div className="current-price-info">
        <h3>{stockName}</h3>
        <p>Current Market Price: ${currentPrice.toFixed(2)}</p>
      </div>
      <form onSubmit={handleSubmit} className="transaction-sections">
        <div className="transaction-section">
          <div className="form-group">
            <label htmlFor="action-select">Action</label>
            <select
              id="action-select"
              value={action}
              onChange={handleActionChange}
              className="form-control"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="price-input">Your Price</label>
            <input
              id="price-input"
              type="number"
              step="0.01"
              value={userPrice}
              onChange={handlePriceChange}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity-input">Quantity</label>
            <input
              id="quantity-input"
              type="number"
              min="0"
              value={quantity}
              onChange={handleQuantityChange}
              className="form-control"
            />
          </div>
          <div className="total-section">
            <p>Total: ${parseFloat(quantity * userPrice || 0).toFixed(2)}</p>
          </div>
          <button type="submit" className={`submit-btn ${action === "buy" ? "buy-btn" : "sell-btn"}`}>
            Submit
          </button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
};

export default BuySell;
