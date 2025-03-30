import React, { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { UserContext } from "../../../UserContext";

// Initialize WebSocket connection
const socket = io("http://localhost:8000", { withCredentials: true });

const BuySell = ({ userID, stockName, stockPrice, onTransactionComplete }) => {
   const [action, setAction] = useState("buy");
   const [quantity, setQuantity] = useState(0);
   const [error, setError] = useState("");
   const [successMessage, setSuccessMessage] = useState("");
   const [price, setPrice] = useState(stockPrice); // New state to handle user-defined price
   const [currentPrice, setCurrentPrice] = useState(stockPrice);
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

            // ✅ Fetch the latest user data and update the context
            const response = await fetch(`http://localhost:8000/get-user`, {
               method: "GET",
               credentials: "include",
               headers: { "Content-Type": "application/json" },
            });

            if (response.ok) {
               const result = await response.json();
               if (result.user) {
                  setUser(result.user); // ✅ Update UserContext
               }
            }
         } else {
            setError(data.message || "Transaction failed.");
         }
      });

      socket.on("newTrade", (trade) => {
         console.log("New Trade Occurred:", trade);
      });

      return () => {
         socket.off("priceUpdate");
         socket.off("orderPlaced");
         socket.off("newTrade");
      };
   }, [stockName, user, action, setUser]);

   const handleSubmit = async (event) => {
      event.preventDefault();

      if (quantity <= 0 || price <= 0) {
         setError("Quantity and price must be greater than zero.");
         return;
      }

      const orderData = {
         stock: stockName,
         type: action,
         quantity: parseInt(quantity),
         price: parseFloat(price),
         userId: user._id,
      };

      console.log("Emitting Order: ", orderData);

      socket.emit("placeOrder", orderData);
   };

   return (
      <div className="border border-gray-300 rounded-lg p-4 mb-4">
         <h2 className="text-xl mb-2">
            {stockName} - Current Price: ${currentPrice}
         </h2>
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
               <label htmlFor="action" className="mr-2">
                  Action:
               </label>
               <select
                  id="action"
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="border rounded px-2 py-1"
               >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
               </select>
            </div>
            <div>
               <label htmlFor="price" className="mr-2">
                  Price:
               </label>
               <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border rounded px-2 py-1"
               />
            </div>
            <div>
               <label htmlFor="quantity" className="mr-2">
                  Quantity:
               </label>
               <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="border rounded px-2 py-1"
               />
            </div>
            <div>
               <p className="text-sm">
                  Total: ${(quantity * price).toFixed(2)}
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
