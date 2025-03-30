export const settingCoinObject = (data, setCoin) => {
  const albumCount = data.albums ? data.albums.length : 0;
  const latestSongsCount = data.latest_songs ? data.latest_songs.length : 0;
  const formattedPrice = data.stock_price ? parseFloat(data.stock_price).toFixed(2) : "N/A";
  const formattedFollowers = data.Followers ? data.Followers.toLocaleString() : "N/A";

  // Construct a fallback description using available data.
  const fallbackDesc = `${data.Artist || data.name || "Unknown Artist"} has a current stock price of $${formattedPrice}! They have ${albumCount} album${albumCount === 1 ? "" : "s"} available and ${formattedFollowers} followers on Spotify. ${latestSongsCount > 0 ? `They also have ${latestSongsCount} latest song${latestSongsCount === 1 ? "" : "s"} out! Would you like to listen to their most popular song?` : ""}`;

  setCoin({
    id: data.id || data._id, // Use data.id if available, otherwise _id
    name: data.name || data.Artist, // Use the 'name' field if available, otherwise 'Artist'
    image: data.artist_image || (data.image && data.image.large) || "", // Prefer artist_image
    desc: data.desc || fallbackDesc, // Use data.desc if available, otherwise fallback
    // Map stock_price, followers, etc.
    stock_price: data.stock_price,
    Followers: data.Followers,
    // Repurpose fields as needed:
    total_volume: data.Followers, // using followers count
    current_price: data.stock_price, // using stock_price as current price
    market_cap: data.market_cap || null, // if available
    // Collect all monthly data into a single object for later use (if needed)
    monthly_data: {
      "Jan-2022": data["Jan-2022"],
      "Feb-2022": data["Feb-2022"],
      "Mar-2022": data["Mar-2022"],
      "Apr-2022": data["Apr-2022"],
      "May-2022": data["May-2022"],
      "Jun-2022": data["Jun-2022"],
      "Jul-2022": data["Jul-2022"],
      "Aug-2022": data["Aug-2022"],
      "Sep-2022": data["Sep-2022"],
      "Oct-2022": data["Oct-2022"],
      "Nov-2022": data["Nov-2022"],
      "Dec-2022": data["Dec-2022"],
      "Jan-2023": data["Jan-2023"],
      "Feb-2023": data["Feb-2023"],
      "Mar-2023": data["Mar-2023"],
      "Apr-2023": data["Apr-2023"],
      "May-2023": data["May-2023"],
      "Jun-2023": data["Jun-2023"],
      "Jul-2023": data["Jul-2023"],
      "Aug-2023": data["Aug-2023"],
      "Sep-2023": data["Sep-2023"],
      "Oct-2023": data["Oct-2023"],
      "Nov-2023": data["Nov-2023"],
      "Dec-2023": data["Dec-2023"],
      "Jan-2024": data["Jan-2024"],
      "Feb-2024": data["Feb-2024"],
      "Mar-2024": data["Mar-2024"],
      "Apr-2024": data["Apr-2024"],
      "May-2024": data["May-2024"],
      "Jun-2024": data["Jun-2024"],
      "Jul-2024": data["Jul-2024"],
      "Aug-2024": data["Aug-2024"],
      "Sep-2024": data["Sep-2024"],
      "Oct-2024": data["Oct-2024"],
      "Nov-2024": data["Nov-2024"],
      "Dec-2024": data["Dec-2024"],
      "Jan-2025": data["Jan-2025"],
      "Feb-2025": data["Feb-2025"],
      "Mar-2025": data["Mar-2025"],
    },
    latest_songs: data.latest_songs || [],
    albums: data.albums || [],
  });
};
