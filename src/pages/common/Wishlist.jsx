import React, { useState, useEffect } from 'react';
import { getWishlistProducts, removeFromWishlist } from './../../services/api';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WishlistPage = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = '6744d64bb94292764d48fe7f';

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const products = await getWishlistProducts(userId);
        console.log('Fetched Wishlist Products:', products); // Debug log
        setWishlistProducts(products);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setError('Failed to load wishlist. Please try again.');
        toast.error('Failed to load wishlist.', { position: 'top-center' });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(userId, productId);
      setWishlistProducts(wishlistProducts.filter((product) => product._id !== productId));
      toast.info('Product removed from wishlist!', { position: 'top-right' });
    } catch (error) {
      console.error('Failed to remove product from wishlist:', error);
      toast.error('Failed to remove from wishlist. Please try again!', { position: 'top-right' });
    }
  };

  if (loading) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  if (error) {
    return <h2 className="text-center mt-5">{error}</h2>;
  }

  if (wishlistProducts.length === 0) {
    return <h2 className="text-center mt-5">Your wishlist is empty.</h2>;
  }

  return (
    <Container fluid className="py-4" style={{ backgroundColor: '#f8f9fa' }}>
      <ToastContainer />
      <h2 className="text-center mb-4" style={{ color: '#343a40' }}>Your Wishlist</h2>
      <Row>
        {wishlistProducts.map((product) => (
          <Col md={4} sm={6} key={product._id} className="mb-4">
            <Card className="h-100 shadow-sm" style={{ border: '1px solid #dee2e6', borderRadius: '10px' }}>
              <Card.Img
                variant="top"
                src={product.imageUrl ? product.imageUrl : '/placeholder.jpg'}
                alt={product.name}
                style={{ height: '200px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = '/placeholder.jpg'; // Fallback to placeholder
                }}
              />
              <Card.Body>
                <Card.Title style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#495057' }}>
                  {product.name}
                </Card.Title>
                <Card.Text style={{ color: '#6c757d', fontSize: '1rem' }}>
                  ${product.price}
                </Card.Text>
                <Card.Text>{product.description}</Card.Text>
                <Button
                  variant="danger"
                  onClick={() => handleRemoveFromWishlist(product._id)}
                >
                  Remove from Wishlist
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default WishlistPage;
