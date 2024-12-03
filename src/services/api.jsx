import axios from 'axios';
import { API_URL } from '../config';

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductsBySeller = async (sellerId) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/seller/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by seller:', error);
    throw error;
  }
};

export const fetchProductById = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/${productId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

export const addToWishlist = async (userId, productId) => {
  try {
    const response = await axios.post(`${API_URL}/api/wishlist/add`, { userId, productId });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};


// Remove product from wishlist
// api.js
export const removeFromWishlist = async (userId, productId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/wishlist/remove`, {
      data: { userId, productId },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    throw error;
  }
};

// Fetch user's wishlist
export const getWishlist = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/wishlist/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/api/otp/verify-otp`,
      {
        email,
        otp
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

export const sendOtp = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/otp/send-otp`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("OTP sent successfully", response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};