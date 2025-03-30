// src/pages/UserProfile.js

import React, { useContext } from "react";
import { UserContext } from "../UserContext";

const UserProfile = () => {
   const { user } = useContext(UserContext);

   if (!user) {
      return <div>Loading...</div>;
   }

   return (
      <div className="p-8">
         <h1 className="text-2xl font-bold mb-4">
            {user.username}'s Portfolio
         </h1>
         <div className="mb-6">
            <p className="text-lg">Balance: ${user.balance?.toFixed(2)}</p>
         </div>
         <h2 className="text-xl font-semibold mb-2">Owned Stocks</h2>
         <table className="min-w-full bg-white border border-gray-300">
            <thead>
               <tr>
                  <th className="py-2 px-4 border-b">Stock</th>
                  <th className="py-2 px-4 border-b">Symbol</th>
                  <th className="py-2 px-4 border-b">Quantity</th>
                  <th className="py-2 px-4 border-b">Current Price</th>
               </tr>
            </thead>
            <tbody>
               {user.stocks && user.stocks.length > 0 ? (
                  user.stocks.map((stock, index) => (
                     <tr key={index}>
                        <td className="py-2 px-4 border-b">{stock.name}</td>
                        <td className="py-2 px-4 border-b">{stock.symbol}</td>
                        <td className="py-2 px-4 border-b">{stock.quantity}</td>
                        <td className="py-2 px-4 border-b">
                           ${stock.price.toFixed(2)}
                        </td>
                     </tr>
                  ))
               ) : (
                  <tr>
                     <td colSpan="4" className="py-2 px-4 text-center">
                        No stocks available
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>
   );
};

export default UserProfile;
