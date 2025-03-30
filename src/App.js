import React from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Coin from "./pages/Coin";
import Compare from "./pages/Compare";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Watchlist from "./pages/Watchlist";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Common/Header";
import { UserProvider } from "./UserContext"; // Import your UserProvider

function App() {
   const theme = createTheme({
      palette: {
         primary: {
            main: "#3a80e9",
         },
      },
   });

   return (
      <div className="App">
         <ToastContainer />
         <ThemeProvider theme={theme}>
            <UserProvider>
               {" "}
               {/* Wrap your entire application with UserProvider */}
               <BrowserRouter>
                  <Header />
                  <Routes>
                     <Route path="/" element={<Home />} />
                     <Route
                        path="/dashboard"
                        element={
                           <ProtectedRoute>
                              <Dashboard />
                           </ProtectedRoute>
                        }
                     />
                     <Route
                        path="/coin/:id"
                        element={
                           <ProtectedRoute>
                              <Coin />
                           </ProtectedRoute>
                        }
                     />
                     <Route
                        path="/compare"
                        element={
                           <ProtectedRoute>
                              <Compare />
                           </ProtectedRoute>
                        }
                     />
                     <Route
                        path="/watchlist"
                        element={
                           <ProtectedRoute>
                              <Watchlist />
                           </ProtectedRoute>
                        }
                     />
                     <Route path="/login" element={<Login />} />
                  </Routes>
               </BrowserRouter>
            </UserProvider>
         </ThemeProvider>
      </div>
   );
}

export default App;
