import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../components/Common/Loader";
import Search from "../components/Dashboard/Search";
import AlbumTabsComponent from "../components/Market/AlbumCovers/Tabs";
import TicketTabsComponent from "../components/Market/ConcertTickets/Tabs";
import AlbumPagination from "../components/Market/AlbumCovers/Pagination";
import TicketPagination from "../components/Market/ConcertTickets/Pagination";
import TopButton from "../components/Common/TopButton";
import Footer from "../components/Common/Footer/footer";
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

function Market() {
  // Album state
  const [albums, setAlbums] = useState([]);
  const [albumLoading, setAlbumLoading] = useState(false);
  const [albumSearch, setAlbumSearch] = useState("");
  const [albumPage, setAlbumPage] = useState(1);
  const [albumTotal, setAlbumTotal] = useState(0);

  // Ticket state
  const [tickets, setTickets] = useState([]);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketSearch, setTicketSearch] = useState("");
  const [ticketPage, setTicketPage] = useState(1);
  const [ticketTotal, setTicketTotal] = useState(0);

  const itemsPerPage = 10;

  // Fetch both albums and tickets on mount
  useEffect(() => {
    fetchAlbums();
    fetchTickets();
  }, []);

  const fetchAlbums = () => {
    setAlbumLoading(true);
    axios
      .get("http://localhost:8000/albums")
      .then((response) => {
        const albumsData = Array.isArray(response.data) ? response.data : [];
        setAlbums(albumsData);
        setAlbumTotal(albumsData.length);
        setAlbumLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching albums:", error.message);
        setAlbumLoading(false);
      });
  };

  const fetchTickets = () => {
    setTicketLoading(true);
    axios
      .get("http://localhost:8000/tickets")
      .then((response) => {
        const ticketsData = Array.isArray(response.data) ? response.data : [];
        setTickets(ticketsData);
        setTicketTotal(ticketsData.length);
        setTicketLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching tickets:", error.message);
        setTicketLoading(false);
      });
  };

  // Filter albums by albumName or artist
  const filteredAlbums = albums.filter(
    (album) =>
      album &&
      (album.albumName.toLowerCase().includes(albumSearch.trim().toLowerCase()) ||
        album.artist.toLowerCase().includes(albumSearch.trim().toLowerCase()))
  );
  const paginatedAlbums = (albumSearch ? filteredAlbums : albums).slice(
    (albumPage - 1) * itemsPerPage,
    albumPage * itemsPerPage
  );

  // Filter tickets by artist or title
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket &&
      (ticket.artist.toLowerCase().includes(ticketSearch.trim().toLowerCase()) ||
        ticket.title.toLowerCase().includes(ticketSearch.trim().toLowerCase()))
  );
  const paginatedTickets = (ticketSearch ? filteredTickets : tickets).slice(
    (ticketPage - 1) * itemsPerPage,
    ticketPage * itemsPerPage
  );

  // Handlers for pagination
  const handleAlbumPageChange = (event, value) => setAlbumPage(value);
  const handleTicketPageChange = (event, value) => setTicketPage(value);

  // Tab context state for switching between Albums and Tickets
  const [tabValue, setTabValue] = useState("albums");
  const handleTabChange = (event, newValue) => setTabValue(newValue);

  // Combined loading state: if either albums or tickets are still loading, show the Loader.
  const loading = albumLoading || ticketLoading;
  if (loading) {
    return (
      <div style={{ textAlign: "center", margin: "2rem" }}>
        <Loader />
      </div>
    );
  }

  return (
    <>
      {/* Search bar: its value depends on the active tab */}
      <Search
        search={tabValue === "albums" ? albumSearch : ticketSearch}
        handleChange={(e) => {
          if (tabValue === "albums") {
            setAlbumSearch(e.target.value);
            setAlbumPage(1);
          } else {
            setTicketSearch(e.target.value);
            setTicketPage(1);
          }
        }}
      />
      <TabContext value={tabValue}>
        <div style={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleTabChange} variant="fullWidth">
            <Tab label="Album Covers" value="albums" />
            <Tab label="Tickets" value="tickets" />
          </TabList>
        </div>
        <TabPanel value="albums">
          <AlbumTabsComponent
            albums={albumSearch ? filteredAlbums : paginatedAlbums}
            setSearch={setAlbumSearch}
          />
          {!albumSearch && (
            <AlbumPagination
              page={albumPage}
              total={albumTotal}
              handlePageChange={handleAlbumPageChange}
            />
          )}
          <pre
            style={{
              background: "#f4f4f4",
              padding: "1rem",
              marginTop: "1rem",
            }}
          >
            {JSON.stringify(paginatedAlbums, null, 2)}
          </pre>
        </TabPanel>
        <TabPanel value="tickets">
          <TicketTabsComponent
            tickets={ticketSearch ? filteredTickets : paginatedTickets}
            setSearch={setTicketSearch}
          />
          {!ticketSearch && (
            <TicketPagination
              page={ticketPage}
              total={ticketTotal}
              handlePageChange={handleTicketPageChange}
            />
          )}
          <pre
            style={{
              background: "#f4f4f4",
              padding: "1rem",
              marginTop: "1rem",
            }}
          >
            {JSON.stringify(paginatedTickets, null, 2)}
          </pre>
        </TabPanel>
      </TabContext>
      <TopButton />
      <Footer />
    </>
  );
}

export default Market;