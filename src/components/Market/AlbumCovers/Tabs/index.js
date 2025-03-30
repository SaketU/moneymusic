import * as React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "./styles.css";
import Grid from "../Grid"; // This component should render a single album cover
import List from "../List"; // This component should render album cover details in a list view
import Button from "../../../Common/Button";

export default function TabsComponent({ albums = [], setSearch }) {
  const [value, setValue] = React.useState("grid");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const style = {
    color: "var(--white)",
    "& .Mui-selected": {
      color: "var(--blue) !important",
    },
    fontFamily: "Inter,sans-serif",
    fontWeight: 600,
    textTransform: "capitalize",
  };

  return (
    <TabContext value={value}>
      <div style={{ borderBottom: 1, borderColor: "divider" }}>
        <TabList onChange={handleChange} variant="fullWidth">
          <Tab label="Grid" value="grid" sx={style} />
          <Tab label="List" value="list" sx={style} />
        </TabList>
      </div>
      <TabPanel value="grid">
        <div className="grid-flex">
          {albums?.length > 0 ? (
            albums.map((album, i) => (
              <Grid
                album={album}
                key={album.id || album._id}
                delay={(i % 4) * 0.2}
              />
            ))
          ) : (
            <div>
              <h1 style={{ textAlign: "center" }}>
                Sorry, couldn't find the album you're looking for 😞
              </h1>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "2rem",
                }}
              >
                <Button text="Clear Search" onClick={() => setSearch("")} />
              </div>
            </div>
          )}
        </div>
      </TabPanel>
      <TabPanel value="list">
        <table className="list-flex">
          {albums?.length > 0 ? (
            albums.map((album, i) => (
              <List
                album={album}
                key={album.id || album._id}
                delay={(i % 8) * 0.2}
              />
            ))
          ) : (
            <div>
              <h1 style={{ textAlign: "center" }}>
                Sorry, couldn't find the album you're looking for 😞
              </h1>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "2rem",
                }}
              >
                <Button text="Clear Search" onClick={() => setSearch("")} />
              </div>
            </div>
          )}
        </table>
      </TabPanel>
    </TabContext>
  );
}
