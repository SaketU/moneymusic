import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../components/Common/Loader";
import Search from "../components/Dashboard/Search";
import TabsComponent from "../components/Dashboard/Tabs";
import PaginationComponent from "../components/Dashboard/Pagination";
import TopButton from "../components/Common/TopButton";
import Footer from "../components/Common/Footer/footer";

function Dashboard() {
   const [artists, setArtists] = useState([]);
   const [loading, setLoading] = useState(false);
   const [search, setSearch] = useState("");
   const [page, setPage] = useState(1);
   const [total, setTotal] = useState(0);
   const itemsPerPage = 10;

   useEffect(() => {
      getData();
   }, []);

   // Fetch all artist data from your backend
   const getData = () => {
      setLoading(true);
      axios
         .get("http://localhost:8000/artists")
         .then((response) => {
            console.log("Backend RESPONSE>>>", response.data);
            setArtists(response.data);
            setTotal(response.data.length);
            setLoading(false);
         })
         .catch((error) => {
            console.log("ERROR>>>", error.message);
            setLoading(false);
         });
   };

   const handleChange = (e) => {
      setSearch(e.target.value);
      setPage(1); // Reset to page 1 when search changes
      console.log(e.target.value);
   };

   // Filter artists locally if a search term is provided
   const filteredArtists = artists.filter((artist) =>
      artist.Artist.toLowerCase().includes(search.trim().toLowerCase())
   );

   // Paginate the list—if searching, show the entire filtered list; otherwise, only the current page
   const paginatedArtists = (search ? filteredArtists : artists).slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
   );

   // Handler for page change
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
               {/* Show the paginated or filtered list in the Tabs component */}
               <TabsComponent
                  artists={search ? filteredArtists : paginatedArtists}
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
               {/* For debugging purposes—remove when not needed */}
               <pre
                  style={{
                     background: "#f4f4f4",
                     padding: "1rem",
                     marginTop: "1rem",
                  }}
               >
                  {JSON.stringify(paginatedArtists, null, 2)}
               </pre>
            </>
         )}
         <TopButton />
         <Footer />
      </>
   );
}

export default Dashboard;
