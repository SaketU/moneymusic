import React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ToggleComponents({ priceType, handlePriceTypeChange }) {
  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      handlePriceTypeChange(newValue);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "1.5rem",
      }}
    >
      <ToggleButtonGroup
        value={priceType}
        exclusive
        onChange={handleChange}
        sx={{
          "&.Mui-selected": {
            color: "var(--purple) !important",
          },
          borderColor: "var(--purple)",
          border: "unset !important",
          "& .MuiToggleButtonGroup-grouped": {
            border: "1px solid var(--purple)!important",
            borderColor: "unset",
            color: "var(--purple) !important",
          },
          "& .MuiToggleButton-standard": {
            color: "var(--purple) !important",
          },
        }}
      >
        <ToggleButton value="stock_price">Stock Price</ToggleButton>
        <ToggleButton value="followers">Followers</ToggleButton>
        <ToggleButton value="monthly_listeners">Monthly Listeners</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}
