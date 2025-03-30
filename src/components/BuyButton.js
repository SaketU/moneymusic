import React, { useContext } from "react";
import Button from "./Common/Button"; // Adjust path if needed
import axios from "axios";
import { UserContext } from "../UserContext"; // Adjust path if needed

function BuyButton({ item, type }) {
  // type: "album" or "ticket"
  const { user, setUser } = useContext(UserContext);

  const handleBuy = async () => {
    if (user.balance < item.price) {
      alert("Insufficient balance to purchase this item.");
      return;
    }
    const newBalance = user.balance - item.price;
    try {
      // Update user's balance on the backend
      const response = await axios.put(
        `http://localhost:8000/api/user/${user._id}/balance`,
        { balance: newBalance },
        { withCredentials: true }
      );
      if (response.data) {
        setUser(response.data); // Update context with new balance
        alert(`Successfully purchased the ${type} for $${item.price.toFixed(2)}`);
      }
    } catch (error) {
      console.error("Error updating balance:", error);
      alert("There was an error processing your purchase.");
    }
  };

  return <Button text="Buy" onClick={handleBuy} />;
}

export default BuyButton;
