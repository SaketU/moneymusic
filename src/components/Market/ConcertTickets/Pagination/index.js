import React from "react";
import "./styles.css";
import Pagination from "@mui/material/Pagination";

export default function PaginationComponent({ page, total, handlePageChange }) {
  // Calculate total pages based on a page size of 10
  const pageCount = Math.ceil(total / 10);

  return (
    <div className="pagination-div">
      <Pagination
        sx={{
          "& .MuiPaginationItem-text": {
            color: "#fff !important",
            border: "1px solid var(--grey)",
          },
          "& .MuiPaginationItem-text:hover": {
            backgroundColor: "transparent !important",
          },
          "& .Mui-selected": {
            backgroundColor: "var(--blue)",
            borderColor: "var(--blue)",
          },
          "& .MuiPaginationItem-ellipsis": {
            border: "none",
          },
        }}
        count={pageCount}
        page={page}
        onChange={handlePageChange}
      />
    </div>
  );
}