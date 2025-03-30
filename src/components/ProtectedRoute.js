import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = useState(null); // null means loading state

   useEffect(() => {
      const checkAuth = async () => {
         try {
            const response = await axios.get("http://localhost:8000/get-user", {
               withCredentials: true, // Allow sending cookies
            });

            if (response.status === 200) {
               setIsAuthenticated(true); // User is authenticated
            }
         } catch (error) {
            console.error("User not authenticated", error);
            setIsAuthenticated(false); // User is not authenticated
         }
      };

      checkAuth();
   }, []);

   if (isAuthenticated === null) {
      return <div>Loading...</div>; // Render a loading screen while checking auth status
   }

   if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
   }

   return children;
};

export default ProtectedRoute;
