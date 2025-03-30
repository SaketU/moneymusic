import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../components/Common/Loader";
import Search from "../components/Dashboard/Search";
import TabsComponent from "../components/Market/Tabs";
import PaginationComponent from "../components/Market/Pagination";
import TopButton from "../components/Common/TopButton";
import Footer from "../components/Common/Footer/footer";

function Market() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    getData();
  }, []);

  // Fetch ticket data from your backend
  const getData = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/tickets")
      .then((response) => {
        console.log("Backend RESPONSE>>>", response.data);
        const ticketsData = Array.isArray(response.data) ? response.data : [];
        setTickets(ticketsData);
        setTotal(ticketsData.length);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error.message);
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Filter tickets by artist name or title (adjust as needed)
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket &&
      (ticket.artist.toLowerCase().includes(search.trim().toLowerCase()) ||
        ticket.title.toLowerCase().includes(search.trim().toLowerCase()))
  );

  // Paginate the list—if searching, show the entire filtered list; otherwise, only the current page
  const paginatedTickets = (search ? filteredTickets : tickets).slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Search search={search} handleChange={handleChange} />
          {/* Pass the paginated or filtered ticket data to the TabsComponent */}
          <TabsComponent
            tickets={search ? filteredTickets : paginatedTickets}
            setSearch={setSearch}
          />
          {/* Show pagination only when no search filter is active */}
          {!search && (
            <PaginationComponent
              page={page}
              total={total}
              handlePageChange={handlePageChange}
            />
          )}
          {/* Debug output—remove when not needed */}
          <pre
            style={{
              background: "#f4f4f4",
              padding: "1rem",
              marginTop: "1rem",
            }}
          >
            {JSON.stringify(paginatedTickets, null, 2)}
          </pre>
        </>
      )}
      <TopButton />
      <Footer />
    </>
  );
}

export default Market;
