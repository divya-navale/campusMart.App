import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { MdProductionQuantityLimits } from "react-icons/md";
import './../../styles/style.css';

const RequestProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productCategory: '',
    description: '',
    contactEmail: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    setSubmitted(true);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <div className="text-center mb-4">
                <MdProductionQuantityLimits size={60} className="text-primary mb-2" />
                <h2 className="mb-3">Request a Product</h2>
                <p className="text-muted">
                  Can't find what you're looking for? Submit a request, and we'll do our best to help!
                </p>
              </div>
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
                  <Form.Group className="mb-3" controlId="formContactEmail">
                    <Form.Label>Contact Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email address"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  <div className="d-grid">
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
                  <Button variant="outline-primary" onClick={() => setSubmitted(false)}>
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
