import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { getProductsBySeller, addProduct, updateProduct } from './../../services/api';
import { RESIDENCE_OPTIONS, CATEGORY_OPTIONS, CONDITION_OPTIONS } from '../../constants/options';

const SellerPage = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    negotiable: false,
    ageYears: '',
    ageMonths: '',
    ageDays: '',
    description: '',
    location: '',
    availableTill: '',
    condition: '',
    image: null,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProductsBySeller();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setNewProduct({
      ...newProduct,
      image: e.target.files[0],
    });
  };

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();

    const productData = { ...newProduct };

    try {
      if (selectedProduct) {
        // If editing an existing product, update it
        const updatedProduct = await updateProduct(selectedProduct._id, productData);
        setProducts(
          products.map((product) =>
            product._id === selectedProduct._id ? updatedProduct : product
          )
        );
        setSelectedProduct(null); // Clear selected product after updating
      } else {
        // If adding a new product, add it
        const addedProduct = await addProduct(productData);
        setProducts([...products, addedProduct]);
      }

      setShowForm(false);
      setNewProduct({
        name: '',
        category: '',
        price: '',
        negotiable: false,
        ageYears: '',
        ageMonths: '',
        ageDays: '',
        description: '',
        location: '',
        availableTill: '',
        condition: '',
        image: null,
      });
    } catch (error) {
      console.error('Error adding/updating product:', error);
      alert('Failed to add/update product. Please check the input data.');
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setNewProduct({
      ...product,
      category: product.category || '',
      condition: product.condition || '',
      location: product.location || '',
    });
    setShowForm(true);
  };

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Your Products</h2>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add Product
        </Button>
        </div>

      <Row>
        {products.map((product) => (
          <Col md={6} className="mb-4" key={product._id}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Row>
                  {/* Image Column */}
                  <Col md={4} sm={12}>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                      />
                    )}
                  </Col>

                  {/* Details Column */}
                  <Col md={8} sm={12}>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>Category: {product.category}</Card.Text>
                    <Card.Text>Price: ${product.price}</Card.Text>
                    <Card.Text>Negotiable: {product.negotiable ? 'Yes' : 'No'}</Card.Text>
                    <Card.Text>Age: {product.age}</Card.Text>
                    <Card.Text>Description: {product.description}</Card.Text>
                    <Card.Text>Location: {product.location}</Card.Text>
                    <Card.Text>Available Till: {product.availableTill}</Card.Text>

                    <Button variant="primary" style={{ marginRight: '20px' }} onClick={() => handleEditProduct(product)}>
                      Edit
                    </Button>
                    <Button variant="success" style={{ marginRight: '20px' }}>
                      Sold
                    </Button>
                    <Button variant="danger" style={{ marginRight: '20px' }}>
                      Delete
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add/Update Product Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct ? 'Edit Product' : 'Add a New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddOrUpdateProduct}>
            {/* Product Name and Category */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
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
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={newProduct.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
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
            </Row>

            {/* Description and Negotiable */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
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
              <Col md={6}>
                <Form.Group>
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

            {/* Age Fields */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
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
                <Form.Group>
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
                <Form.Group>
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

            {/* Condition, Available Till, and Location */}
            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Condition</Form.Label>
                  <Form.Select
                    name="condition"
                    value={newProduct.condition}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Condition</option>
                    {CONDITION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
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
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Select
                    name="location"
                    value={newProduct.location}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Location</option>
                    {RESIDENCE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Image Upload */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
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

            {/* Submit Button */}
            <Button variant="success" type="submit" block>
              {selectedProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SellerPage;
