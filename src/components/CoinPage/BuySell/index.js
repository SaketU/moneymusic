import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import axios from "axios"; // <-- Import axios for fetching user data
import { UserContext } from "../../../UserContext";

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
               alert(
                  "Stock sold successfully and your balance has been updated."
               );
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
            setUser(response.data.user); // Update the global user state with the new user data
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
      <div className="border border-gray-300 rounded-lg p-4 mb-4">
         <h2 className="text-xl mb-2">
            {stockName} - Current Market Price: ${currentPrice}
         </h2>
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label htmlFor="action" className="mr-2 text-white font-bold text-sm md:text-base font-sans">
                  Action:
               </label>
               <select
                  id="action"
                  value={action}
                  onChange={handleActionChange}
                  className="btn"
               >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
               </select>
            </div>
            <div>
               <label htmlFor="price" className="mr-2 text-white font-bold text-sm md:text-base font-sans">
                  Your Price:
               </label>
               <input
                  type="number"
                  id="price"
                  value={userPrice}
                  onChange={handlePriceChange}
                  className="border rounded px-2 py-1"
                  step="0.01"
               />
            </div>
            <div>
               <label htmlFor="quantity" className="mr-2 text-white font-bold text-sm md:text-base font-sans">
                  Quantity:
               </label>
               <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="border rounded px-2 py-1"
               />
            </div>
            <div>
               <p className="text-sm">
                  Total: ${parseFloat(quantity * userPrice || 0).toFixed(2)}
               </p>
            </div>
            <button
               type="submit"
               className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
            >
               Submit
            </button>
         </form>
         {error && <p className="text-red-500 mt-2">{error}</p>}
         {successMessage && (
            <p className="text-green-500 mt-2">{successMessage}</p>
         )}
      </div>
   );
};

export default BuySell;
