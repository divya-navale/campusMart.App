import api from './axios';

export const signupUser = async (name, email, password, location) => {
  try {
    const response = await api.post(`/api/users`, { name, email, password, location });

    if (response.status === 201) {
      const otpResponse = await sendOtp(email, "signup");
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
    console.log("fetch products", response);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/api/products/${productId}`);
    const nr = await api.delete(`/api/remove-notifications/${productId}`);
    const wr = await api.delete(`/api/remove-product/${productId}`);
    console.log('test' + nr,wr);
    return response.data;
  } catch (error) {
    console.log('Error deleting product', error);
    throw new Error(error.message);
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

export const addToWishlist = async (productId) => {
  const userId = getUserIdFromToken();
  try {
    const response = await api.post(`/api/wishlist/add`, { userId, productId });
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  const userId = getUserIdFromToken();
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

export const getWishlist = async () => {
  const userId = getUserIdFromToken();
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

export const sendOtp = async (email, source) => {
  try {
    const response = await api.post(`/api/otp/send-otp`, { email, source });
    console.log("OTP sent successfully", response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const getWishlistProducts = async () => {
  const userId = getUserIdFromToken();
  try {
    const response = await api.get(`/api/wishlist/${userId}`);
    console.log('Wishlist API Response:', response.data);
    if (response.data.message && response.data.message === 'No wishlisted products for this user') {
      return [];
    }
    if (response.data && response.data.wishlist && Array.isArray(response.data.wishlist.products)) {
      return response.data.wishlist.products;
    }
    throw new Error('Invalid wishlist response format');
  } catch (error) {
    console.error('Error fetching wishlist products:', error);
    throw error;
  }
};

export const getProductsBySeller = async () => {
  const sellerId = getUserIdFromToken();
  try {
    const response = await api.get(`/api/products/seller/${sellerId}`);
    console.log("products", response);
    return response.data;

  } catch (error) {
    throw new Error('Failed to fetch products by seller: ' + error.message);
  }
};

export const getProductDetailsById = async (productId) => {
  try {
    const response = await api.get(`/api/products/${productId}`);  
    return response.data;  
  } catch (error) {
    throw new Error('Error fetching product details: ' + error.message);
  }
};


export const addProduct = async (productData) => {
  const sellerId = getUserIdFromToken();
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
    formData.append('sellerId', sellerId);
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
    const response = await api.post(`/api/update-password`, { email, password });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error updating password');
  }
};

export const fetchUserDetails = async (sellerId) => {
  console.log(sellerId)
  try {
    const response = await api.get(`/api/users/${sellerId}`);
    console.log(response);
    return response.data;  
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    throw error; 
  }
};

//getuserdetails from userid
export const getUserDetails = async () => {
  const userid = getUserIdFromToken();
  try {
    const response = await api.get(`api/users/${userid}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching user details');
  }
};

//send notification 
export const createNotification = async (sellerId, productId, message) => {
  const buyerId = getUserIdFromToken();
  try {
    const response = await api.post('/api/notifications', {
      buyerId,
      sellerId,
      productId,
      message,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

//getnotification
export const getNotifications = async (userRole) => {
  const userId = getUserIdFromToken();
  try {
    const response = await api.get(`/api/notifications/${userId}/${userRole}`);
    return response.data.notifications; 
  } catch (error) {
    throw new Error('Error fetching notifications: ' + error.message);
  }
};

export const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return null;
  }
  try {
    const decodedToken = parseJwt(token);
    return decodedToken.userId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Function to decode JWT
const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};


export const updateProduct = async (productId, updatedData, file) => {
  try {
    const sellerId = getUserIdFromToken();
    const formData = new FormData();
    
    formData.append('name', updatedData.name);
    formData.append('category', updatedData.category);
    formData.append('price', updatedData.price);
    formData.append('negotiable', updatedData.negotiable);
    formData.append('ageYears', updatedData.ageYears);
    formData.append('ageMonths', updatedData.ageMonths);
    formData.append('ageDays', updatedData.ageDays);
    formData.append('description', updatedData.description);
    formData.append('availableTill', updatedData.availableTill);
    formData.append('location', updatedData.location);
    formData.append('contact', updatedData.contact);
    formData.append('sellerId', sellerId);
    formData.append('condition', updatedData.condition);

    if (file) {
      formData.append('image', file);
    }

    const response = await api.put(`/api/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

export const submitProductRequest = async (productData) => {
  try {
    productData.userId = getUserIdFromToken();
    const response = await api.post('/api/request-product', productData);
    return response.data;
  } catch (error) {
    throw new Error('Error submitting product request');
  }
};

export const getUserProductRequests = async () => {
  try {
    const userId = getUserIdFromToken();
    const response = await api.get(`/api/request-product?userId=${userId}`);  // Pass userId as a query parameter
    return response.data;
  } catch (error) {
    throw new Error('Error fetching product requests');
  }
};


export const getAllRequestedProducts = async () => {
  try {
    const response = await api.get('/api/all-requested-products');
    return response.data;
  } catch (error) {
    throw new Error('Error fetching all product requests');
  }
};

export const deleteProductRequest = async (productId) => {
  try {

    const response = await api.delete(`/api/request-product/${productId}`);
    return response.data; 
  } catch (error) {
    throw new Error(error.message);
  }
};

export const markProductAsSold = async (productId) => {
  try {
    const response = await api.put(`/api/products/${productId}/sold`);
    console.log('Product marked as sold:', response);
  } catch (error) {
    console.error('Failed to mark product as sold:', error.message);
  }
};

const formatPriceRange = (priceRange) => {
  if (priceRange.includes('+')) {
    console.log(priceRange);
    return '50+';
  }
  return priceRange;
};

export const getFilteredProducts = async (filters) => {
  try {
    const formattedPriceRange = formatPriceRange(filters.priceRange);
    const queryString = new URLSearchParams({
      ...filters,
      priceRange: formattedPriceRange,  
    }).toString();
    console.log(queryString);
    const response = await api.get(`/api/filtered-products?${queryString}`);
    console.log("filter response", response);
    return response.data.products; 
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    throw error;
  }
};