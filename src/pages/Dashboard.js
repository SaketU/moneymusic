import axios from "axios";
import React, { useEffect, useState } from "react";
import Header from "../components/Common/Header";
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

  useEffect(() => {
    getData();
  }, []);

  // Fetch all artist data from your backend
  const getData = () => {
    setLoading(true);
    axios
      .get(`http://localhost:8000/artists`)
      .then((response) => {
        console.log("Backend RESPONSE>>>", response.data);
        // Since the endpoint returns a simple array, use that directly
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
    console.log(e.target.value);
  };

  // Filter artists locally if search term is provided
  const filteredArtists = artists.filter((artist) =>
    artist.Artist.toLowerCase().includes(search.trim().toLowerCase())
  );

  // Handler for page change (if you plan to paginate the list on the frontend)
  const handlePageChange = (event, value) => {
    setPage(value);
    // You can further paginate your artists array here if needed
  };

  return (
    <>
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <>
          <Search search={search} handleChange={handleChange} />
          {/* Pass filtered artists if a search term exists, else pass all artists */}
          <TabsComponent artists={search ? filteredArtists : artists} setSearch={setSearch} />
          {/* Show pagination only when no search filter is applied */}
          {!search && (
            <PaginationComponent
              page={page}
              total={total}
              handlePageChange={handlePageChange}
            />
          )}
          {/* Debug: Print the artists data received */}
          
        </>
      )}
      <TopButton />
      <Footer />
    </>
  );
}

export default Dashboard;
