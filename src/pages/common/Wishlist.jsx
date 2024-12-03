import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const Wishlist = () => {
  // Sample wishlist products
  const [wishlistProducts, setWishlistProducts] = useState([
    {
      id: 1,
      name: 'Study Table',
      price: '$50',
      image: 'https://via.placeholder.com/150',
      description: 'A sturdy study table perfect for small spaces.',
    },
    {
      id: 2,
      name: 'Office Chair',
      price: '$100',
      image: 'https://via.placeholder.com/150',
      description: 'Comfortable office chair with adjustable height.',
    },
    {
      id: 3,
      name: 'Bedside Lamp',
      price: '$30',
      image: 'https://via.placeholder.com/150',
      description: 'A modern bedside lamp for your cozy evenings.',
    },
  ]);

  // Handle removing product from the wishlist
  const handleRemove = (productId) => {
    setWishlistProducts(wishlistProducts.filter((product) => product.id !== productId));
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4" style={{ color: '#343a40', fontWeight: 'bold' }}>
        My Wishlist
      </h2>
      <Row>
        {wishlistProducts.length > 0 ? (
          wishlistProducts.map((product) => (
            <Col md={4} sm={6} key={product.id} className="mb-4">
              <Card className="h-100 shadow-sm" style={{ borderRadius: '10px' }}>
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  style={{
                    height: '200px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#495057' }}>
                    {product.name}
                  </Card.Title>
                  <Card.Text style={{ fontSize: '1rem', color: '#6c757d' }}>{product.description}</Card.Text>
                  <Card.Text style={{ fontWeight: 'bold', color: '#007bff', fontSize: '1.1rem' }}>
                    {product.price}
                  </Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="danger"
                      size="sm"
                      style={{
                        backgroundColor: '#dc3545',
                        borderColor: '#dc3545',
                        fontWeight: 'bold',
                      }}
                      onClick={() => handleRemove(product.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <h5 className="text-center mt-4" style={{ color: '#6c757d' }}>
            Your wishlist is empty.
          </h5>
        )}
      </Row>
    </Container>
  );
};

export default Wishlist;
