import React, { useEffect, useState, useContext } from "react";
import Button from "../Button";
import TemporaryDrawer from "./drawer";
import "./styles.css";
import Switch from "@mui/material/Switch";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../../../UserContext";

function Header() {
   const { user, setUser } = useContext(UserContext); // Access user data globally

   const [darkMode, setDarkMode] = useState(
      localStorage.getItem("theme") === "dark" ? true : false
   );

   useEffect(() => {
      if (localStorage.getItem("theme") === "dark") {
         setDark();
      } else {
         setLight();
      }
   }, []);

   const changeMode = () => {
      if (localStorage.getItem("theme") !== "dark") {
         setDark();
      } else {
         setLight();
      }
      setDarkMode(!darkMode);
      toast.success("Theme Changed!");
   };

   const setDark = () => {
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
   };

   const setLight = () => {
      localStorage.setItem("theme", "light");
      document.documentElement.setAttribute("data-theme", "light");
   };

   const logout = async () => {
      try {
         const response = await fetch("http://localhost:8000/logout", {
            method: "POST",
            credentials: "include", // Important to include cookies in the request
         });

         if (response.ok) {
            console.log("Logout successful");
            // Optionally, redirect the user to the login page
            window.location.href = "/login";
         } else {
            console.error("Logout failed");
         }
      } catch (error) {
         console.error("Error during logout:", error);
      }
   };

   return (
      <div className="header">
         <h1>
            CryptoTracker<span style={{ color: "var(--blue)" }}>.</span>
         </h1>
         <div className="links">
            <Switch checked={darkMode} onClick={() => changeMode()} />

            <Link to="/">
               <p className="link">Home</p>
            </Link>
            <Link to="/compare">
               <p className="link">Compare</p>
            </Link>
            <Link to="/watchlist">
               <p className="link">Watchlist</p>
            </Link>
            <Link to="/dashboard">
               <p className="link">Dashboard</p>
            </Link>

            {user ? (
               <>
                  <span className="user-info">
                     Welcome, {user.fullName}! - Balance: ${user.balance}
                  </span>
                  <Button text={"Logout"} onClick={logout} />
               </>
            ) : (
               <Link to="/login">
                  <Button text={"Login"} />
               </Link>
            )}
         </div>
         <div className="drawer-component">
            <TemporaryDrawer />
         </div>
      </div>
   );
}

export default Header;
