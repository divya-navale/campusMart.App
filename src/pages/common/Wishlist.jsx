import React, { useState, useEffect } from 'react';
import { getWishlistProducts, removeFromWishlist, fetchUserDetails, createNotification } from './../../services/api';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrashAlt, FaCommentDots } from 'react-icons/fa';
import gif from './../../assets/emptycart.gif';

const WishlistPage = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [loadingSeller, setLoadingSeller] = useState(false);
  const [emptyWishlistImage, setEmptyWishlistImage] = useState('');
  const [message, setMessage] = useState(''); 

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const products = await getWishlistProducts();
        console.log('Fetched Wishlist Products:', products); 
        
        if (products.length === 0) {
          setError('Your wishlist is empty.');
          setEmptyWishlistImage(gif);
        } else {
          setWishlistProducts(products);
        }
      } catch (err) {
        setError('Failed to load wishlist. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  
  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setWishlistProducts(wishlistProducts.filter((product) => product._id !== productId));
      toast.info('Product removed from wishlist!', { position: 'top-right' });
    } catch (error) {
      toast.error('Failed to remove from wishlist. Please try again!', { position: 'top-right' });
    }
  };

  const fetchSellerDetails = async (sellerId) => {
    setLoadingSeller(true);
    try {
      const userData = await fetchUserDetails(sellerId);
      setSellerDetails({
        name: userData.name,
        email: userData.email,
      });
    } catch (error) {
      toast.error('Failed to load seller details. Please try again!', { position: 'top-center' });
    } finally {
      setLoadingSeller(false);
    }
  };

  const handleShowModal = async (product) => {
    setSelectedProduct(product);
    await fetchSellerDetails(product.sellerId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setSellerDetails(null);
  };

  const handleSendNotification = async () => {
    try {
      await createNotification(selectedProduct.sellerId, selectedProduct._id ,message);
      toast.success('Notification sent successfully to Seller!', { position: 'top-center' });
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to send notification. Please try again!', { position: 'top-center' });
    }
  };
  if (loading) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  if (error) {
    return (
      <div className="text-center mt-5">
        <h2>{error}</h2>
        {emptyWishlistImage && (
          <img
            src={emptyWishlistImage} 
            alt="Empty Wishlist"
            style={{ width: '300px', height: 'auto', display: 'block', margin: '0 auto' }}
          />
        )}
        <p>No products in your wishlist. Sstart adding some!</p>
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return (
      <div className="text-center mt-5">
        <h2>{error}</h2>
        {emptyWishlistImage && (
          <img
            src={emptyWishlistImage} 
            alt="Empty Wishlist"
            style={{ width: '300px', height: 'auto', display: 'block', margin: '0 auto' }}
          />
        )}
        <p>No products in your wishlist. dStart adding some!</p>
      </div>
    );
  }

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa' }}>
      <ToastContainer />
      <h2 className="text-center mb-4" style={{ color: '#343a40' }}>Your Wishlist</h2>
      <Row className="g-4">
        {wishlistProducts.map((product) => (
          <Col md={6} key={product._id}>
            <Card className="shadow-sm h-100 d-flex flex-row align-items-stretch" style={{ border: '1px solid #dee2e6', borderRadius: '10px' }}>
              <Card.Img
                src={product.imageUrl}
                alt={product.name}
                style={{
                  width: '40%',
                  height: 'auto',
                  objectFit: 'cover',
                  borderTopLeftRadius: '10px',
                  borderBottomLeftRadius: '10px',
                }}
              />
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#495057' }}>
                      {product.name}
                    </Card.Title>
                    <Card.Text style={{ color: '#6c757d', fontSize: '1rem' }}>
                      Price: ${product.price}
                    </Card.Text>
                  </div>
                  <div className="d-flex">
                    <FaTrashAlt
                      size={20}
                      color='#e63946'
                      className="wishlist-icon ms-2"
                      onClick={() => handleRemoveFromWishlist(product._id)}
                      title={'Remove from Wishlist'}
                      style={{ cursor: 'pointer' }}
                    />
                    <FaCommentDots
                      size={20}
                      color="#007bff"
                      className="contact-icon ms-3"
                      onClick={() => handleShowModal(product)}
                      title="Contact Seller"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>
                <Card.Text className="text-muted mt-2">{product.description}</Card.Text>
              </Card.Body>

            </Card>
          </Col>
        ))}
      </Row>

      {selectedProduct && sellerDetails && !loadingSeller && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Contact Seller</Modal.Title>
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
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleSendNotification}>
                Send Notification
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default WishlistPage;
