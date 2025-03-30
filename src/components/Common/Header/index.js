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

   const handleLogout = async () => {
      try {
         await axios.post(
            "http://localhost:8000/logout",
            {},
            { withCredentials: true }
         );
         setUser(null); // Clear user data upon logout
         toast.success("Logged out successfully!");
      } catch (error) {
         console.error("Logout failed:", error);
         toast.error("Logout failed. Please try again.");
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
                  <Button text={"Logout"} onClick={handleLogout} />
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
