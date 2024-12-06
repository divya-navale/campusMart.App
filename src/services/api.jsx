import api from './axios';

export const signupUser = async (name, email, password, location) => {
  try {
    const response = await api.post(`/api/users`, { name, email, password, location });

    if (response.status === 201) {
      const otpResponse = await sendOtp(email);
      if (otpResponse.status === 200) {
        console.log("OTP sent to email:", email);
      }

      return response.data;
    } else {
      throw new Error('Failed to create account');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post(`/api/users/verify`, { email, password });

    if (response.data.verified) {
      const token = response.data.token;
      localStorage.setItem('token', token);
      return response.data;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const fetchProducts = async () => {
  try {
    const response = await api.get(`/api/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductsBySeller = async (sellerId) => {
  try {
    const response = await api.get(`/api/products/seller/${sellerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by seller:', error);
    throw error;
  }
};

export const fetchProductById = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

export const addToWishlist = async (userId, productId) => {
  try {
    const response = await api.post(`/api/wishlist/add`, { userId, productId });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (userId, productId) => {
  try {
    const response = await api.delete(`/api/wishlist/remove`, {
      data: { userId, productId },
    });
    return response.data;
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    throw error;
  }
};

export const getWishlist = async (userId) => {
  try {
    const response = await api.get(`/api/wishlist/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const response = await api.post(`/api/otp/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

export const sendOtp = async (email) => {
  try {
    const response = await api.post(`/api/otp/send-otp`, { email });
    console.log("OTP sent successfully", response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const getWishlistProducts = async (userId) => {
  try {
    const response = await api.get(`/api/wishlist/${userId}`);
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

export const getProductsBySeller = async (sellerId) => {
  try {
    const response = await api.get(`/api/products/seller/${sellerId}`);
    return response.data;
    
  } catch (error) {
    throw new Error('Failed to fetch products by seller: ' + error.message);
  }
};

export const addProduct = async (productData) => {
  try {
    const formData = new FormData();
    
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
    formData.append('condition', productData.condition);
    formData.append('sellerId', productData.sellerId);
    formData.append('image', productData.image);
    const response = await api.post(`/api/products`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.product;
  } catch (error) {
    throw new Error('Failed to add product: ' + error.message);
  }
};


export const logoutUser = async () => {
  try {
    const response = await api.post('/api/users/logout');
    console.log('Logout successful:', response.data);
    if (response.status === 200) {
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      return response.data;
    }
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const response = await api.get(`/api/users/email/${email}`);
    console.log('User fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const updatePassword = async (email, password) => {
  try {
    const response = await api.post('/api/users/update-password', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating password');
  }
};
