import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";

const UserProfile = () => {
   const { user } = useContext(UserContext);

   if (!user) {
      return <div>Loading...</div>;
   }

   return (
      <div>
         <h1>{user.fullName}'s Profile</h1>
         <p>Balance: ${user.balance ? user.balance.toFixed(2) : "0.00"}</p>

         <h2>Your Stocks</h2>
         <ul>
            {user.stocks && user.stocks.length > 0 ? ( // Changed 'userData' to 'user'
               user.stocks.map(
                  (
                     stock,
                     index // Changed 'userData' to 'user'
                  ) => (
                     <li key={index}>
                        Stock ID: {stock.stockId} -
                        {stock.price
                           ? `Price: $${stock.price.toFixed(2)}`
                           : "No Price Available"}
                     </li>
                  )
               )
            ) : (
               <li>No stocks owned</li>
            )}
         </ul>
      </div>
   );
};

export default UserProfile;
