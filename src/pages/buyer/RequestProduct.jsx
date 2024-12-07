import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Card, ListGroup, Alert } from 'react-bootstrap';
import { MdProductionQuantityLimits } from "react-icons/md";
import './../../styles/style.css';
import { submitProductRequest, getUserProductRequests, deleteProductRequest } from '../../services/api';
import { FaTrashAlt } from 'react-icons/fa';

const RequestProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productCategory: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [requestedProducts, setRequestedProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch requested products
  useEffect(() => {
    const fetchRequestedProducts = async () => {
      try {
        const response = await getUserProductRequests();  // API to fetch requested products
        setRequestedProducts(response);
      } catch (error) {
        console.error('Error fetching requested products:', error.message);
        setErrorMessage('Failed to load requested products');
      }
    };

    fetchRequestedProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await submitProductRequest(formData);
      setRequestedProducts((prevState) => [...prevState, response]);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit product request:', error.message);
    }
  };

  const handleReset = () => {
    setFormData({
      productName: '',
      productCategory: '',
      description: '',
    });
    setSubmitted(false);
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProductRequest(productId);  // API call to delete the product
      setRequestedProducts(requestedProducts.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Failed to delete product:', error.message);
      setErrorMessage('Failed to delete product');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        {/* Left Side: Requested Products */}
        <Col md={6}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h2 className="mb-3 text-center">Your Requested Products</h2>
              {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
              <ListGroup className="scrollable-list" style={{ maxHeight: '500px', overflowY: 'auto', border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
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
                      <FaTrashAlt
                      size={20}
                      color='#e63946'
                      className="wishlist-icon ms-2"
                      onClick={() => handleDelete(product._id)}
                      title={'Remove from requests'}
                      style={{ cursor: 'pointer' }}
                    />
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Side: Product Request Form */}
        <Col md={6}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <div className="text-center mb-4">
                <MdProductionQuantityLimits size={60} className="text-primary mb-2" />
              </div>
              {!submitted && (
                <div className="text-center mb-4">
                  <h2 className="mb-3">Request a Product</h2>
                  <p className="text-muted">
                    Can't find what you're looking for? Submit a request, and we'll do our best to help!
                  </p>
                </div>
              )}
              {!submitted ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formProductName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the name of the product"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formProductCategory">
                    <Form.Label>Product Category</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="E.g., Electronics, Furniture, Books"
                      name="productCategory"
                      value={formData.productCategory}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Provide more details about the product"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-center mt-4">
                    <Button variant="primary" type="submit">
                      Submit Request
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="text-center">
                  <h4>Thank you for your request!</h4>
                  <p className="text-muted">
                    We have received your product request and will get back to you soon.
                  </p>
                  <Button variant="outline-primary" onClick={handleReset}>
                    Submit Another Request
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RequestProduct;
