import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Info from "../components/CoinPage/Info";
import LineChart from "../components/CoinPage/LineChart";
import BuySell from "../components/CoinPage/BuySell";
import SelectDays from "../components/CoinPage/SelectDays";
import ToggleComponents from "../components/CoinPage/ToggleComponent";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import AlbumCarousel from "../components/CoinPage/AlbumCarousel";
import AudioPlayer from "../components/AudioPlayer"; // Ensure correct path
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
   const [audioClipUrl, setAudioClipUrl] = useState("");

   useEffect(() => {
      if (id) {
         getData();
      }
   }, [id]);

   const getData = async () => {
      setLoading(true);
      try {
         const coinData = await getCoinData(id, setError);
         settingCoinObject(coinData, setCoin);

         if (coinData && coinData.stock_prices) {
            const prices = coinData.stock_prices;
            settingChartData(setChartData, prices);
         }
      } catch (error) {
         console.error("Error in getData:", error);
         setError(true);
      } finally {
         setLoading(false);
      }
   };

   // When coin data is loaded, choose a random audio clip from song0 to song2.
   useEffect(() => {
      if (coin && coin.name) {
         // Random number between 0 and 2 (inclusive)
         const randomNumber = Math.floor(Math.random() * 3);
         // Build the URL based on your public folder structure
         const clipUrl = `/assets/music/${coin.name}/song${randomNumber}.mp3`;
         console.log("Audio Clip URL:", clipUrl);
         setAudioClipUrl(clipUrl);
      }
   }, [coin]);

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

   if (loading)
      return (
         <div style={{ textAlign: "center", margin: "2rem" }}>
            <Loader />
         </div>
      );
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

   const roundedPrice =
      coin.stock_price && !isNaN(coin.stock_price)
         ? Number(coin.stock_price).toFixed(2)
         : "N/A";

   return (
      <>
         {/* Header Section */}
         <div className="grey-wrapper" style={{ marginBottom: "1rem", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
               {/* Left Section: Image */}
               <div style={{ flex: 1, textAlign: "center" }}>
                  {coin.image && (
                  <img
                     src={coin.image}
                     alt={coin.name}
                     style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                     }}
                  />
                  )}
               </div>
               {/* Center Section: Coin Name */}
               <div style={{ flex: 1, textAlign: "center" }}>
                  <h1 style={{ margin: "0 0 0.3rem 0", fontSize: "1.4rem" }}>
                  {coin.name}
                  </h1>
               </div>
               {/* Right Section: Price & Followers */}
               <div style={{ flex: 1, textAlign: "center" }}>
                  <h2 style={{ margin: "0 0 0.3rem 0", color: "green", fontSize: "1.1rem" }}>
                  Price: ${roundedPrice}
                  </h2>
                  <p style={{ margin: 0, fontSize: "1rem" }}>
                  Followers: {coin.Followers ? coin.Followers : 0}
                  </p>
               </div>
            </div>
            </div>


        

         {/* Line Chart Section */}
         <div className="grey-wrapper" style={{ marginBottom: "1rem", padding: "1rem" }}>
            <LineChart chartData={chartData} />
         </div>

         {/* Audio Player Component for Random Clip */}
         {audioClipUrl && <AudioPlayer url={audioClipUrl} />}

         <div className="grey-wrapper" style={{ marginBottom: "1rem", padding: "1rem" }}>
            <BuySell stockPrice={coin.stock_price} stockName={coin.name} />
         </div>

         {/* Info & Albums Section */}
         <div className="grey-wrapper" style={{ padding: "1rem" }}>
            <Info title={coin.name} desc={coin.desc} />
            {coin.albums && coin.albums.length > 0 && <AlbumCarousel albums={coin.albums} />}
         </div>
      </>
   );
}

export default Coin;
