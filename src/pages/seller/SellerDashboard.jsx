import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { getProductsBySeller, addProduct, updateProduct, deleteProduct, markProductAsSold } from './../../services/api';
import { RESIDENCE_OPTIONS, CATEGORY_OPTIONS, CONDITION_OPTIONS } from '../../constants/options';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    emptyForm();
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
    const productData = {
      ...newProduct,
      availableTill: newProduct.availableTill
        ? new Date(newProduct.availableTill).toISOString()
        : '',
    };

    const file = newProduct.image;

    try {
      let response;
      if (selectedProduct) {
        response = await updateProduct(selectedProduct._id, productData, file);
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === selectedProduct._id ? response.product : product
          )
        );
      } else {
        response = await addProduct(productData, file);
        setProducts((prevProducts) => [...prevProducts, response]);
      }

      emptyForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding/updating product:', error);
      alert('Failed to add/update product. Please check the input data.');
    }
  };
  

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);

      setProducts(products.filter(product => product._id !== productId));
      toast.success('Product deleted successfully!', { position: 'top-right' });
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again later.');
    }
  };

  const handleSoldProduct = async (productId) => {
    try {
      await markProductAsSold(productId);

      setProducts(products.filter(product => product._id !== productId));
      toast.success('Congratulations! Product sold!', { position: 'top-right' });
    } catch (error) {
      console.error('Error sold product:', error);
      alert('Failed to sold product. Please try again later.');
    }
  }

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    const formattedAvailableTill = product.availableTill
      ? new Date(product.availableTill).toISOString().split('T')[0]
      : '';

    setNewProduct({
      ...product,
      category: product.category || '',
      condition: product.condition || '',
      location: product.location || '',
      availableTill: formattedAvailableTill,
    });
    setShowForm(true);
  };

  const emptyForm = () => {
    setSelectedProduct("");
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
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Your Products</h2>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add Product
        </Button>
      </div>

      <Row>
        {products.map((product, index) => (
          <Col md={6} className="mb-4" key={index}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Row>
                  <Col md={4} sm={12}>
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                      />
                    )}
                  </Col>

                  <Col md={8} sm={12}>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>Category: {product.category}</Card.Text>
                    <Card.Text>Price: ${product.price}</Card.Text>
                    <Card.Text>Negotiable: {product.negotiable ? 'Yes' : 'No'}</Card.Text>
                    <Card.Text>
                      Age: {`${product.ageYears || 0} years, ${product.ageMonths || 0} months, ${product.ageDays || 0} days`}
                    </Card.Text>
                    <Card.Text>Description: {product.description}</Card.Text>
                    <Card.Text>Location: {product.location || 'N/A'}</Card.Text>
                    <Card.Text>Available Till: {new Date(product.availableTill).toLocaleDateString()}</Card.Text>

                    <Button variant="primary" className="me-2" onClick={() => handleEditProduct(product)}>
                      Edit
                    </Button>
                    <Button variant="success" className="me-2" onClick = {() => handleSoldProduct(product._id)}>
                      Sold
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteProduct(product._id)}>
                      Delete
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct ? 'Edit Product' : 'Add a New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddOrUpdateProduct}>
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
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Upload Image</Form.Label>
                  {
                    selectedProduct && (
                      <>
                        <Form.Control
                          type="file"
                          name="image"
                          onChange={handleFileChange}
                        />
                      </>
                    )
                  }
                  {
                    !selectedProduct && (
                      <>
                        <Form.Control
                          type="file"
                          name="image"
                          onChange={handleFileChange}
                          required
                        />
                      </>
                    )
                  }
                </Form.Group>
              </Col>
              <Col md={6}>
                {selectedProduct && selectedProduct.imageUrl && (
                  <Form.Group>
                    <Form.Label style={{ fontStyle: 'italic' }}>
                      Click the link to view the existing image
                    </Form.Label>
                    <div>
                      <a
                        href={selectedProduct.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#007bff', textDecoration: 'underline', fontStyle: 'italic' }}
                      >
                        View Image
                      </a>
                    </div>
                  </Form.Group>
                )}
              </Col>
            </Row>

            <Button variant="success" type="submit" className="d-block w-100">
              {selectedProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default SellerPage;
