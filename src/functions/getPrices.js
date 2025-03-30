export const getPrices = (data, setError) => {
  try {
    return data.stock_prices;
  } catch (error) {
    console.error(error.message);
    if (setError) setError(true);
    return null;
  }
};