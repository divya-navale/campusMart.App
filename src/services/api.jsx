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

//Fetch user's wishlist
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

// export const getWishlistProducts = async (userId) => {
//   try {
//     const response = await axios.get(`/api/wishlist/${userId}`);
//     console.log('Wishlist API Response:', response.data);
//     return response.data.wishlist.products; // Ensure this is returning an array of products
//   } catch (error) {
//     console.error('Error fetching wishlist:', error);
//     throw error;
//   }
// };

export const getWishlistProducts = async (userId) => {
  try {
    const response = await axios.get(`/api/wishlist/${userId}`);
    console.log('Wishlist API Response:', response.data);
    if (response.data && response.data.wishlist && Array.isArray(response.data.wishlist.products)) {
      return response.data.wishlist.products;
    }
    throw new Error('Invalid wishlist response format');
  } catch (error) {
    console.error('Error fetching wishlist products:', error);
    throw error;
  }
};

// Fetch products by seller ID
export const getProductsBySeller = async (sellerId) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/seller/${sellerId}`);
    return response.data;  // return the list of products
    
  } catch (error) {
    throw new Error('Failed to fetch products by seller: ' + error.message);
  }
};

// Add a new product (single image)
export const addProduct = async (productData) => {
  try {
    const formData = new FormData();
    
    // Append all the required fields to the FormData
    formData.append('name', productData.name);
    formData.append('category', productData.category);
    formData.append('price', productData.price);
    formData.append('negotiable', productData.negotiable);
    formData.append('ageYears', productData.ageYears);
    formData.append('ageMonths', productData.ageMonths);
    formData.append('ageDays', productData.ageDays);
    formData.append('description', productData.description);
    formData.append('availableTill', productData.availableTill);
    formData.append('location', productData.location);
    formData.append('contact', productData.contact);
    formData.append('condition', productData.condition);  // Append condition
    formData.append('sellerId', productData.sellerId);  // Append sellerId
    formData.append('image', productData.image);  // Append the image file (single image, not an array)

    // Send the request to the backend API
    const response = await axios.post(`${API_URL}/api/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.product;  // Return the newly added product
  } catch (error) {
    throw new Error('Failed to add product: ' + error.message);
  }
};
