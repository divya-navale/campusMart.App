import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductById, getWishlist, addToWishlist, removeFromWishlist, fetchUserDetails, createNotification } from './../../services/api';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { FaHeart } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');  // State for the message input
  const [sellerDetails, setSellerDetails] = useState(null);  // Seller details for modal

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const productData = await fetchProductById(productId);
        setProduct(productData);

        const wishlistData = await getWishlist();
        if (wishlistData.wishlist) {
          const userWishlist = wishlistData.wishlist.products.map((product) => product._id);
          setWishlist(userWishlist);
        }

        // Fetch seller details if available
        if (productData?.sellerId) {
          const sellerData = await fetchUserDetails(productData.sellerId);
          setSellerDetails(sellerData);
        }
      } catch (err) {
        setError('Failed to fetch product details.');
      } finally {
        setLoading(false);
      }
    };

    getProductDetails();
  }, [productId]);

  // Toggle wishlist items (add or remove)
  const toggleWishlist = async (productId) => {
    if (wishlist.includes(productId)) {
      // Remove from wishlist
      try {
        await removeFromWishlist(productId); // API call to remove
        setWishlist(wishlist.filter((id) => id !== productId)); // Update local state
        toast.info('Product removed from wishlist!', { position: "top-right", autoClose: 3000 });
      } catch (error) {
        console.error('Failed to remove product from wishlist:', error);
        toast.error('Failed to remove from wishlist. Try again!', { position: "top-right" });
      }
    } else {
      // Add to wishlist
      try {
        await addToWishlist(productId); // API call to add
        setWishlist([...wishlist, productId]); // Update local state
        toast.success('Product added to wishlist!', { position: "top-right", autoClose: 3000 });
      } catch (error) {
        console.error('Failed to add product to wishlist:', error);
        toast.error('Failed to add to wishlist. Try again!', { position: "top-right" });
      }
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // Send notification to the seller
  const handleSendNotification = async () => {
    try {
      if (!message.trim()) {
        toast.error('Please enter a message before sending!', { position: 'top-center' });
        return;
      }
      // Call API to create a notification
      await createNotification(sellerDetails._id, product._id, message);
      toast.success('Notification sent successfully to Seller!', { position: 'top-center' });
      handleCloseModal();  // Close the modal after sending notification
    } catch (error) {
      console.error('Failed to send notification:', error);
      toast.error('Failed to send notification. Please try again!', { position: 'top-center' });
    }
  };

  if (loading) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  if (error) {
    return <h2 className="text-center mt-5">{error}</h2>;
  }

  if (!product) {
    return <h2 className="text-center mt-5">Product Not Found</h2>;
  }

  return (
    <>
      {/* ToastContainer for notifications */}
      <ToastContainer />
      <Container className="mt-5" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '20px' }}>
        <Row>
          <Col md={6}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                height: '70%',
                width: '80%',
                borderRadius: '10px',
                objectFit: 'cover',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            />
          </Col>
          <Col md={6}>
            <h2 style={{ color: '#495057', fontWeight: 'bold' }}>{product.name}</h2>
            <h4 style={{ color: '#6c757d' }}>${product.price}</h4>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Negotiable:</strong> {product.negotiable ? 'Yes' : 'No'}</p>
            <p><strong>Product Age:</strong> {product.ageYears} years {product.ageMonths} months {product.ageDays} days</p>
            <p><strong>Condition</strong> {product.condition}</p>
            <p><strong>Location:</strong> {product.location}</p>
            <p><strong>Available Till:</strong> {product.availableTill}</p>
            <p><strong>Description</strong> {product.description}</p>
            <div className="d-flex gap-3 align-items-center mt-4">
              {/* Heart Icon for Wishlist */}
              <div className="d-flex align-items-center">
                <FaHeart
                  size={22}
                  color={wishlist.includes(product._id) ? '#e63946' : '#adb5bd'} // Red if in wishlist, gray otherwise
                  style={{ cursor: 'pointer', marginRight: '5px' }}
                  onClick={() => toggleWishlist(product._id)} // Toggle wishlist
                  title={
                    wishlist.includes(product._id)
                      ? 'Remove from Wishlist'
                      : 'Add to Wishlist'
                  }
                />
                <span style={{ fontSize: '0.9rem', color: '#6c757d' }}>Wishlist</span>
              </div>

              {/* Contact Seller Button */}
              <Button
                variant="outline-success"
                style={{
                  color: '#f8f9fa',
                  backgroundColor: '#6c757d',
                  borderColor: '#6c757d',
                }}
                onClick={handleShowModal}
              >
                Contact Seller
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.25rem', color: '#495057' }}>Contact Seller</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table style={{ margin: '0 auto', fontSize: '1rem', color: '#495057' }}>
            <tbody>
              <tr>
                <td style={{ padding: '5px 10px', fontWeight: 'bold', textAlign: 'right' }}>Name:</td>
                <td style={{ padding: '5px 10px', textAlign: 'left' }}>{sellerDetails?.name || 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ padding: '5px 10px', fontWeight: 'bold', textAlign: 'right' }}>Email:</td>
                <td style={{ padding: '5px 10px', textAlign: 'left' }}>{sellerDetails?.email || 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ padding: '5px 10px', fontWeight: 'bold', textAlign: 'right' }}>Message:</td>
                <td style={{ padding: '5px 10px', textAlign: 'left' }}>
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
            <Button
              variant="primary"
              style={{
                backgroundColor: '#6c757d',
                borderColor: '#6c757d',
                color: '#f8f9fa',
              }}
              onClick={handleSendNotification}
            >
              Send Notification
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductDetail;
