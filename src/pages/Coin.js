import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import SelectDays from "../components/CoinPage/SelectDays";
import ToggleComponents from "../components/CoinPage/ToggleComponent";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import List from "../components/Dashboard/List";
import { getCoinData } from "../functions/getCoinData";
import { getPrices } from "../functions/getPrices";
import { settingChartData } from "../functions/settingChartData";
import { settingCoinObject } from "../functions/settingCoinObject";

function Coin() {
  const { id } = useParams();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [coin, setCoin] = useState({});
  const [days, setDays] = useState(30);
  const [priceType, setPriceType] = useState("prices");

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const getData = async () => {
    setLoading(true);
    try {
      // Fetch coin/artist data from your API
      const coinData = await getCoinData(id, setError);
      console.log("Coin DATA>>>>", coinData);
      // Map API response to our coin object
      settingCoinObject(coinData, setCoin);
      // Use the stock_prices variable for the chart data
      if (coinData && coinData.stock_prices) {
        const prices = coinData.stock_prices;
        console.log("Stock Prices Data:", prices);
        settingChartData(setChartData, prices);
      } else {
        console.log("No stock_prices data found.");
      }
    } catch (error) {
      console.error("Error in getData:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDaysChange = async (event) => {
    setLoading(true);
    setDays(event.target.value);
    const prices = await getPrices(id, event.target.value, priceType, setError);
    if (prices) {
      settingChartData(setChartData, prices);
    }
    setLoading(false);
  };

  const handlePriceTypeChange = async (event) => {
    setLoading(true);
    setPriceType(event.target.value);
    const prices = await getPrices(id, days, event.target.value, setError);
    if (prices) {
      settingChartData(setChartData, prices);
    }
    setLoading(false);
  };

  if (loading) return <Loader />;
  if (error || !coin.id)
    return (
      <div style={{ textAlign: "center", margin: "2rem" }}>
        <h1>Sorry, Couldn't find the coin you're looking for 😞</h1>
        <div style={{ display: "flex", justifyContent: "center", margin: "2rem" }}>
          <a href="/dashboard">
            <Button text="Dashboard" />
          </a>
        </div>
      </div>
    );

  return (
    <>
      <div className="grey-wrapper">
        <List coin={coin} delay={0.5} />
      </div>
      <div className="grey-wrapper">
        <SelectDays handleDaysChange={handleDaysChange} days={days} />
        <ToggleComponents priceType={priceType} handlePriceTypeChange={handlePriceTypeChange} />
        <LineChart chartData={chartData} />
      </div>
      <Info title={coin.name} desc={coin.desc} />
    </>
  );
}

export default Coin;
