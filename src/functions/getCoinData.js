import axios from "axios";

export const getCoinData = async (id, setError) => {
  try {
    const response = await axios.get(`http://localhost:8000/artist/${id}`, {
      withCredentials: true, // ensures the cookie is sent
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching artist data:", error.message);
    if (setError) setError(true);
    return null;
  }
};

