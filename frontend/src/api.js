import axios from "axios";

const API_URL = "http://localhost:8000";

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};

export const createCheckoutSession = async (priceId) => {
  try {
    const response = await axios.post(`${API_URL}/create-checkout-session`, {
      price_id: priceId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating checkout session", error);
    throw error;
  }
};
