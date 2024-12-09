import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../../components/buyer/Filtercontext'; // Import context
import { getFilteredProducts, addToWishlist, removeFromWishlist, getWishlist, fetchUserDetails, createNotification } from './../../services/api';  // Import services
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { FaHeart, FaCommentDots } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/buyerDashboard.css';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { selectedResidence, selectedPriceRange, selectedCondition, selectedAge, selectedCategory } = useFilters();
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [loadingSeller, setLoadingSeller] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch filtered products when filters change
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      try {
        const filters = {
          residence: selectedResidence.join(','),
          priceRange: selectedPriceRange.join(','),
          condition: selectedCondition.join(','),
          age: selectedAge.join(','),
          category: selectedCategory.join(','),
        };

        const fetchedProducts = await getFilteredProducts(filters);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching filtered products:', error);
        toast.error('Failed to load filtered products. Please try again!');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedResidence, selectedPriceRange, selectedCondition, selectedAge, selectedCategory]);

  // Fetch wishlist data
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistData = await getWishlist();
        if (wishlistData.message && wishlistData.message === 'No wishlisted products for this user') {
          console.log('No wishlisted products for this user');
        } else {
          const userWishlist = wishlistData.wishlist.products.map((product) => product._id);
          setWishlist(userWishlist);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist. Please try again!');
      }
    };

    fetchWishlist();
  }, []);

  // Handle adding/removing products from wishlist
  const toggleWishlist = async (productId) => {
    if (wishlist.includes(productId)) {
      try {
        await removeFromWishlist(productId);
        setWishlist(wishlist.filter((id) => id !== productId));
        toast.info('Product removed from wishlist!', { position: 'top-right' });
      } catch (error) {
        console.error('Failed to remove product from wishlist:', error);
        toast.error('Failed to remove from wishlist. Please try again!', { position: 'top-right' });
      }
    } else {
      try {
        await addToWishlist(productId);
        setWishlist([...wishlist, productId]);
        toast.success('Product added to wishlist!', { position: 'top-right' });
      } catch (error) {
        console.error('Failed to add product to wishlist:', error);
        toast.error('Failed to add to wishlist. Please try again!', { position: 'top-right' });
      }
    }
  };

  // View product details
  const viewProductDetails = (productId) => {
    // Navigate to product details page
    console.log("navigating to product id", productId);
    navigate(`/product/${productId}`);
  };

  // Fetch seller details
  const fetchSellerDetails = async (sellerId) => {
    setLoadingSeller(true);
    try {
      const userData = await fetchUserDetails(sellerId);
      const sellerInfo = {
        name: userData.name,
        email: userData.email,
      };
      setSellerDetails(sellerInfo);
    } catch (error) {
      console.error('Failed to fetch seller details:', error);
      toast.error('Failed to load seller details. Please try again!', { position: 'top-center' });
    } finally {
      setLoadingSeller(false);
    }
  };

  // Show modal to contact seller
  const handleShowModal = async (product) => {
    setSelectedProduct(product);
    await fetchSellerDetails(product.sellerId);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setSellerDetails(null);
    setMessage('');
  };

  // Send notification to seller
  const handleSendNotification = async () => {
    try {
      if (!message.trim()) {
        toast.error('Please enter a message before sending!', { position: 'top-center' });
        return;
      }
      await createNotification(selectedProduct.sellerId, selectedProduct._id, message);
      toast.success('Notification sent successfully to Seller!', { position: 'top-center' });
      handleCloseModal();
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error('Failed to send notification. Please try again!', { position: 'top-center' });
    }
  };

  return (
    <Container className="mt-5">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <Row>
          {products.map((product) => (
            <Col md={4} sm={6} className="mb-4" key={product._id}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={product.imageUrl}
                  alt={product.name}
                  className="card-img"
                  onClick={() => viewProductDetails(product._id)}
                />
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <Card.Title className="mb-0">{product.name}</Card.Title>
                    <div className="d-flex align-items-center">
                      <FaHeart
                        size={18}
                        color={wishlist.includes(product._id) ? '#e63946' : '#adb5bd'}
                        className="wishlist-icon ms-2"
                        onClick={() => toggleWishlist(product._id)}
                        title={wishlist.includes(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        style={{ cursor: 'pointer' }}
                      />
                      <FaCommentDots
                        size={18}
                        color="#007bff"
                        className="contact-icon ms-3"
                        onClick={() => handleShowModal(product)}
                        title="Contact Seller"
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                  <Card.Text className="mt-2">Price: ${product.price}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Modal for contacting seller */}
      {selectedProduct && sellerDetails && !loadingSeller && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Contact Seller</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table>
              <tbody>
                <tr>
                  <td className="label">Name:</td>
                  <td className="value">{sellerDetails.name}</td>
                </tr>
                <tr>
                  <td className="label">Email:</td>
                  <td className="value">{sellerDetails.email}</td>
                </tr>
                <tr>
                  <td className="label">Message:</td>
                  <td className="value">
                    <textarea
                      className="form-control"
                      rows="4"
                      placeholder="Enter your message here"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="d-flex justify-content-end mt-4">
              <Button variant="secondary" className="notification-btn" onClick={handleSendNotification}>
                Send Notification
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}

      <ToastContainer />
    </Container>
  );
};

export default BuyerDashboard;
