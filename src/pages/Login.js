import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
   // Initialize darkMode based on localStorage or the current data-theme attribute.
   const [darkMode, setDarkMode] = useState(
      localStorage.getItem("theme") === "dark"
   );

   const navigate = useNavigate();

   const [isLogin, setIsLogin] = useState(true);
   const [errorMessage, setErrorMessage] = useState("");

   const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
   });

   // Update darkMode when the data-theme attribute changes
   useEffect(() => {
      const observer = new MutationObserver((mutationsList) => {
         for (const mutation of mutationsList) {
            if (mutation.attributeName === "data-theme") {
               const newTheme =
                  document.documentElement.getAttribute("data-theme");
               setDarkMode(newTheme === "dark");
            }
         }
      });
      observer.observe(document.documentElement, { attributes: true });
      return () => observer.disconnect();
   }, []);

   const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         let response;
         if (isLogin) {
            response = await axios.post(
               "http://localhost:8000/login",
               {
                  email: formData.email,
                  password: formData.password,
               },
               { withCredentials: true }
            );

            console.log("Login Successful:", response.data);
            navigate("/dashboard"); // Redirect to dashboard instead of reloading
         } else {
            response = await axios.post(
               "http://localhost:8000/signup",
               {
                  fullName: formData.fullName,
                  email: formData.email,
                  username: formData.username,
                  password: formData.password,
                  confirmPassword: formData.confirmPassword,
               },
               { withCredentials: true }
            );

            console.log("Signup Successful:", response.data);
            navigate("/dashboard"); // Redirect to dashboard after signup
         }
      } catch (error) {
         console.error(
            "Error:",
            error.response ? error.response.data.message : error.message
         );
         setErrorMessage(
            error.response ? error.response.data.message : "An error occurred."
         );
      }
   };

   // Define styles based on darkMode.
   const containerStyle = {
      maxWidth: "400px",
      margin: "2rem auto",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      backgroundColor: darkMode ? "#1a1a1a" : "#fff",
      color: darkMode ? "#fff" : "#111",
   };

   const headingStyle = {
      textAlign: "center",
      marginBottom: "1.5rem",
      color: darkMode ? "#b583ff" : "#8e44ad",
   };

   const inputGroupStyle = {
      marginBottom: "1rem",
      display: "flex",
      flexDirection: "column",
   };

   const labelStyle = {
      marginBottom: "0.5rem",
      fontWeight: "bold",
   };

   const inputStyle = {
      padding: "0.75rem",
      borderRadius: "4px",
      fontSize: "1rem",
      border: darkMode ? "1px solid #555" : "1px solid #ddd",
      backgroundColor: darkMode ? "#333" : "#fff",
      color: darkMode ? "#fff" : "#111",
   };

   const buttonStyle = {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "4px",
      border: "none",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      backgroundColor: "#8e44ad",
      color: "#fff",
   };

   const toggleButtonStyle = {
      background: "none",
      border: "none",
      cursor: "pointer",
      textDecoration: "underline",
      color: darkMode ? "#b583ff" : "#8e44ad",
   };

   const errorTextStyle = {
      textAlign: "center",
      color: "#f94141",
      marginBottom: "1rem",
   };

   return (
      <div>
         <div style={containerStyle}>
            <h2 style={headingStyle}>{isLogin ? "Login" : "Sign Up"}</h2>
            {errorMessage && <p style={errorTextStyle}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
               {!isLogin && (
                  <>
                     <div style={inputGroupStyle}>
                        <label htmlFor="fullName" style={labelStyle}>
                           Full Name
                        </label>
                        <input
                           type="text"
                           id="fullName"
                           name="fullName"
                           value={formData.fullName}
                           onChange={handleInputChange}
                           placeholder="Your full name"
                           style={inputStyle}
                           required
                        />
                     </div>
                     <div style={inputGroupStyle}>
                        <label htmlFor="username" style={labelStyle}>
                           Username
                        </label>
                        <input
                           type="text"
                           id="username"
                           name="username"
                           value={formData.username}
                           onChange={handleInputChange}
                           placeholder="Username"
                           style={inputStyle}
                           required
                        />
                     </div>
                  </>
               )}
               <div style={inputGroupStyle}>
                  <label htmlFor="email" style={labelStyle}>
                     Email
                  </label>
                  <input
                     type="email"
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={handleInputChange}
                     placeholder="Email"
                     style={inputStyle}
                     required
                  />
               </div>
               <div style={inputGroupStyle}>
                  <label htmlFor="password" style={labelStyle}>
                     Password
                  </label>
                  <input
                     type="password"
                     id="password"
                     name="password"
                     value={formData.password}
                     onChange={handleInputChange}
                     placeholder="Password"
                     style={inputStyle}
                     required
                  />
               </div>
               {!isLogin && (
                  <div style={inputGroupStyle}>
                     <label htmlFor="confirmPassword" style={labelStyle}>
                        Confirm Password
                     </label>
                     <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        style={inputStyle}
                        required
                     />
                  </div>
               )}
               <div style={{ textAlign: "center", margin: "1rem 0" }}>
                  <button type="submit" style={buttonStyle}>
                     {isLogin ? "Login" : "Sign Up"}
                  </button>
               </div>
            </form>
            <p style={{ textAlign: "center" }}>
               {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
               <button
                  type="button"
                  onClick={() => {
                     setIsLogin(!isLogin);
                     setErrorMessage("");
                  }}
                  style={toggleButtonStyle}
               >
                  {isLogin ? "Sign Up" : "Login"}
               </button>
            </p>
         </div>
      </div>
   );
};

export default Login;
