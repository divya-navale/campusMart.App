import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Alert, Row, Col, Image, Card } from 'react-bootstrap';
import { getNotifications, getProductDetailsById, getAllRequestedProducts } from '../../services/api';


const SellerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [requestedProducts, setRequestedProducts] = useState([]);  // State for requested products

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications('seller');  // Fetch notifications for seller
        setNotifications(data);
      } catch (error) {
        setError('Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    const fetchRequestedProducts = async () => {
      try {
        const data = await getAllRequestedProducts();  // Fetch requested products
        setRequestedProducts(data);
      } catch (error) {
        setError('Failed to load requested products.');
      }
    };

    fetchNotifications();
    fetchRequestedProducts();  // Call to fetch requested products
  }, []);

  const fetchProductDetails = async (productId) => {
    try {
      const product = await getProductDetailsById(productId);
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        [productId]: product,
      }));
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Notifications</h2>

      {loading && <Alert variant="info">Loading notifications...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {/* Column for Seller Notifications */}
        <Col md={6}>
          <h4>Your Notifications</h4>
          {Array.isArray(notifications) && notifications.length > 0 ? (
            notifications.map((notification, index) => {
              const productId = notification.productId._id;
              const product = productDetails[productId];

              if (!product) {
                fetchProductDetails(productId);
              }

              return (
                <Col xs={12} key={notification._id} className="mb-3">
                  <Card className="shadow-sm">
                    <Card.Body>
                      <Row>
                        {/* Product Image Column (larger image) */}
                        <Col xs={12} md={3} className="d-flex justify-content-center">
                          {product && product.imageUrl && (
                            <Image
                              src={product.imageUrl}
                              alt="Product Image"
                              fluid
                              style={{ height: '180px', width: 'auto' }}
                            />
                          )}
                        </Col>

                        {/* Product Details, Buyer Info, and Price Column */}
                        <Col xs={12} md={5}>
                          <Row className="mb-2">
                            <Col xs={12}>
                              <h5>{product ? product.name : 'Loading...'} </h5>
                              <p><strong>Description:</strong> {product ? product.description : 'N/A'}</p>
                            </Col>
                          </Row>

                          <Row className="mb-2">
                            <Col xs={12}>
                              <p><strong>Buyer Name:</strong> {notification.buyerId ? notification.buyerId.name : 'N/A'}</p>
                              <p><strong>Buyer Email:</strong> {notification.buyerId ? notification.buyerId.email : 'N/A'}</p>
                            </Col>
                          </Row>

                          {/* Price Row */}
                          <Row className="mb-2">
                            <Col xs={12}>
                              <p><strong>Price:</strong> ${product ? product.price : 'N/A'}</p>
                            </Col>
                          </Row>
                        </Col>

                        {/* Message Column */}
                        <Col xs={12} md={4} className="d-flex flex-column justify-content-start"
                          style={{ backgroundColor: '#f7f7f7', padding: '10px', borderRadius: '8px' }}
                        >
                          <Row className="mb-2">
                            <Col xs={12}>
                              <strong>{notification.message}</strong>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })
          ) : (
            <ListGroup.Item>No notifications found.</ListGroup.Item>
          )}
        </Col>

        {/* Column for Requested Products */}
        <Col md={6}>
        <Card className="shadow-sm">
        <Card.Body>
              <h2 className="mb-3 text-center">Buyer Requested Products</h2>
              <ListGroup className="scrollable-list" style={{ maxHeight: '500px', overflowY: 'auto', padding: '10px', borderRadius: '5px' }}>
                {requestedProducts.length === 0 ? (
                  <ListGroup.Item>No requested products yet.</ListGroup.Item>
                ) : (
                  requestedProducts.map((product, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{product.productName}</strong>
                        <br />
                        <em>{product.productCategory}</em>
                        <p>{product.description}</p>
                      </div>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SellerNotifications;
