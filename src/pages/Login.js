import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // import useNavigate for redirection
import Header from "../components/Common/Header";

const Login = () => {
   // State to toggle between login and sign up
   const [isLogin, setIsLogin] = useState(true);
   // State to hold error messages
   const [errorMessage, setErrorMessage] = useState("");
   const navigate = useNavigate();

   // Manage form fields in a single object.
   const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
   });

   // Handle input changes for all fields.
   const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   // Handle form submission.
   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         let response;
         if (isLogin) {
            // Login: call the /login endpoint with email and password.
            response = await axios.post("http://localhost:8000/login", {
               email: formData.email,
               password: formData.password,
            });
            console.log("Login Successful:", response.data);
         } else {
            // Sign Up: call the /set-password endpoint with required fields.
            response = await axios.post("http://localhost:8000/set-password", {
               fullName: formData.fullName,
               email: formData.email,
               username: formData.username,
               password: formData.password,
               confirmPassword: formData.confirmPassword,
            });
            console.log("Signup Successful:", response.data);
         }
         // Redirect to Home page on successful login/sign up.
         navigate("/");
      } catch (error) {
         console.error(
            "Error:",
            error.response ? error.response.data.message : error.message
         );
         // Set the error message to display to the user.
         setErrorMessage(
            error.response ? error.response.data.message : "An 3error occurred."
         );
      }
   };

   return (
      <div>
         <Header />
         <div
            className="auth-container"
            style={{ maxWidth: "400px", margin: "2rem auto" }}
         >
            <h2 style={{ textAlign: "center" }}>
               {isLogin ? "Login" : "Sign Up"}
            </h2>
            {/* Display error message if any */}
            {errorMessage && (
               <p style={{ textAlign: "center", color: "red" }}>
                  {errorMessage}
               </p>
            )}
            <form onSubmit={handleSubmit}>
               {/* For sign up, show additional fields */}
               {!isLogin && (
                  <>
                     <div className="input-group">
                        <label htmlFor="fullName">Full Name</label>
                        <input
                           type="text"
                           id="fullName"
                           name="fullName"
                           value={formData.fullName}
                           onChange={handleInputChange}
                           placeholder="Your full name"
                           required
                        />
                     </div>
                     <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                           type="text"
                           id="username"
                           name="username"
                           value={formData.username}
                           onChange={handleInputChange}
                           placeholder="Username"
                           required
                        />
                     </div>
                  </>
               )}
               <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                     type="email"
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={handleInputChange}
                     placeholder="Email"
                     required
                  />
               </div>
               <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <input
                     type="password"
                     id="password"
                     name="password"
                     value={formData.password}
                     onChange={handleInputChange}
                     placeholder="Password"
                     required
                  />
               </div>
               {!isLogin && (
                  <div className="input-group">
                     <label htmlFor="confirmPassword">Confirm Password</label>
                     <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm Password"
                        required
                     />
                  </div>
               )}
               <div style={{ textAlign: "center", margin: "1rem 0" }}>
                  <button
                     type="submit"
                     style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
                  >
                     {isLogin ? "Login" : "Sign Up"}
                  </button>
               </div>
            </form>
            <p style={{ textAlign: "center" }}>
               {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
               <button
                  type="button"
                  onClick={() => {
                     console.log("Toggle Clicked!"); // Check if this logs
                     setIsLogin(!isLogin);
                     setErrorMessage(""); // Clear error message on toggle.
                  }}
                  style={{
                     background: "none",
                     border: "none",
                     color: "blue",
                     cursor: "pointer",
                  }}
               >
                  {isLogin ? "Sign Up" : "Login"}
               </button>
            </p>
         </div>
      </div>
   );
};

export default Login;
