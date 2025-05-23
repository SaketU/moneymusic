import * as React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import "./styles.css";
import Grid from "../Grid";
import List from "../List";
import Button from "../../../Common/Button";

export default function TabsComponent({ tickets = [], setSearch }) {
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
          {tickets?.length > 0 ? (
            tickets.map((ticket, i) => (
              <Grid
                ticket={ticket}
                key={ticket.id || ticket._id}
                delay={(i % 4) * 0.2}
              />
            ))
          ) : (
            <div>
              <h1 style={{ textAlign: "center" }}>
                Sorry, couldn't find the ticket you're looking for 😞
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
          {tickets?.length > 0 ? (
            tickets.map((ticket, i) => (
              <List
                ticket={ticket}
                key={ticket.id || ticket._id}
                delay={(i % 8) * 0.2}
              />
            ))
          ) : (
            <div>
              <h1 style={{ textAlign: "center" }}>
                Sorry, couldn't find the ticket you're looking for 😞
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