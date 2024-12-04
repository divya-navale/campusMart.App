// src/SellerPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { getProductsBySeller, addProduct } from './../../services/api'; // Import the API functions

const SellerPage = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    negotiable: false,
    ageYears: '',
    ageMonths: '',
    ageDays: '',
    description: '',
    contact: '',
    location: '',
    availableTill: '',
    condition: '',
    image: null,  // Store single image here
    sellerId: '',
  });
  const sellerId = '674e8257040ea8407a3e551f'; // Replace with actual seller ID, ideally from auth context

  // Fetch products on page load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProductsBySeller(sellerId);
        setProducts(fetchedProducts);
        
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [sellerId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle file input for a single image
  const handleFileChange = (e) => {
    setNewProduct({
      ...newProduct,
      image: e.target.files[0],  // Store only the first selected file
    });
  };

  // Handle form submission to add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
  
    // Calculate product age (years, months, days)
    //const productAge = `${newProduct.ageYears} years, ${newProduct.ageMonths} months, ${newProduct.ageDays} days`;
  
    const productData = {
      ...newProduct,
      sellerId: '674e8257040ea8407a3e551f', // Hardcoded sellerId for now
    };
  
    console.log('Product Data:', productData);
    try {
      // Call the addProduct API (use the existing function from api.js)
      const addedProduct = await addProduct(productData);
  
      // Update the products list with the newly added product
      setProducts([...products, addedProduct]);
  
      // Close the modal after submitting
      setShowForm(false);
  
      // Reset form fields
      setNewProduct({
        name: '',
        category: '',
        price: '',
        negotiable: false,
        ageYears: '',
        ageMonths: '',
        ageDays: '',
        description: '',
        contact: '',
        location: '',
        availableTill: '',
        condition: '', // Reset condition
        image: null, // Reset image
        sellerId: '674e8257040ea8407a3e551f',  // Hardcoded sellerId
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please check the input data.');
    }
  };
  
  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Your Products</h2>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add Product
        </Button>
      </div>

      {/* Product Display */}

<Row>
  {products.map((product) => (
    <Col md={4} sm={6} className="mb-4" key={product._id}>
      <Card className="h-100 shadow-sm">
        <Card.Body>
        {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: 'auto' }} />
          )}
          
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>Category: {product.category}</Card.Text>
          <Card.Text>Price: ${product.price}</Card.Text>
          <Card.Text>Negotiable: {product.negotiable ? 'Yes' : 'No'}</Card.Text>
          <Card.Text>Age: {product.age}</Card.Text>
          <Card.Text>Description: {product.description}</Card.Text>
          <Card.Text>Contact: {product.contact}</Card.Text>
          <Card.Text>Location: {product.location}</Card.Text>
          <Card.Text>Available Till: {product.availableTill}</Card.Text>

          {/* Display the image if imageUrl exists */}
          
          <Button variant="primary">Edit Product</Button>
        </Card.Body>
      </Card>
    </Col>
  ))}
</Row>


      {/* Add Product Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add a New Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddProduct}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={newProduct.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={newProduct.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Negotiable</Form.Label>
                <Form.Check
                  type="checkbox"
                  name="negotiable"
                  checked={newProduct.negotiable}
                  onChange={handleChange}
                  label="Is negotiable?"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Age (Years)</Form.Label>
                <Form.Control
                  type="number"
                  name="ageYears"
                  value={newProduct.ageYears}
                  onChange={handleChange}
                  placeholder="Years"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Age (Months)</Form.Label>
                <Form.Control
                  type="number"
                  name="ageMonths"
                  value={newProduct.ageMonths}
                  onChange={handleChange}
                  placeholder="Months"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Age (Days)</Form.Label>
                <Form.Control
                  type="number"
                  name="ageDays"
                  value={newProduct.ageDays}
                  onChange={handleChange}
                  placeholder="Days"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Condition</Form.Label>
                <Form.Control
                  type="text"
                  name="condition"
                  value={newProduct.condition}
                  onChange={handleChange}
                  placeholder="Enter condition"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Available Till</Form.Label>
                <Form.Control
                  type="date"
                  name="availableTill"
                  value={newProduct.availableTill}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Contact Info</Form.Label>
                <Form.Control
                  type="text"
                  name="contact"
                  value={newProduct.contact}
                  onChange={handleChange}
                  placeholder="Enter contact info"
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={newProduct.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Button variant="success" type="submit">
              Add Product
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </Container>
  );
};

export default SellerPage;
