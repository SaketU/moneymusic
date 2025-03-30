import React from "react";
import "./styles.css";
import { motion } from "framer-motion";
import VinylCanvas from "../../Models/VinylCanvas";


function MainComponent() {
  return (
    <div className="main-flex">
      <div className="info-landing">
        <motion.h1
          className="heading1"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Track Artists
        </motion.h1>
        <motion.h1
          className="heading2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.75, duration: 1 }}
        >
          Real Time.
        </motion.h1>
        <motion.p
          className="info-text"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          Discover the True Value of Music Artists 🚀{" "}
        </motion.p>
      </div>

      {/* Canvas section with Vinyl Player */}
      {/* <div className="canvas-container">
        <VinylCanvas />
      </div> */}
    </div>
  );
}

export default MainComponent;
