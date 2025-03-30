export const settingCoinObject = (data, setCoin) => {
  // Build an object from the artist data using the available fields.
  setCoin({
    id: data.id || data._id, // Use data.id if available, otherwise _id
    name: data.name || data.Artist, // Use the 'name' field if available, otherwise 'Artist'
    image: data.artist_image || (data.image && data.image.large) || "", // Prefer artist_image
    // For description, we can use the first album name or a fallback message
    desc:
      data.desc ||
      (data.albums && data.albums.length
        ? `This artist has ${data.albums.length} albums available.`
        : "No description available."),
    // Map stock_price, followers, etc.
    stock_price: data.stock_price,
    Followers: data.Followers,
    // You can repurpose these fields as needed
    // For example, treat 'total_volume' as followers and 'market_cap' as stock_price,
    // Or you might choose to add a dedicated field for monthly data.
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
    // You can include any additional fields as needed (e.g., latest_songs)
    latest_songs: data.latest_songs || [],
    albums: data.albums || [],
  });
};
