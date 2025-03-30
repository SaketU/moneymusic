import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext(null); // Make sure you're exporting the context

export const UserProvider = ({ children }) => {
   const [user, setUser] = useState(null);

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const response = await axios.get("http://localhost:8000/get-user", {
               withCredentials: true,
            });
            setUser(response.data.user); // Set user data globally
         } catch (error) {
            setUser(null);
         }
      };

      fetchUser();
   }, []);

   return (
      <UserContext.Provider value={{ user, setUser }}>
         {children}
      </UserContext.Provider>
   );
};
