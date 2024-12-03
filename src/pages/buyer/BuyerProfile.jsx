import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { RESIDENCE_OPTIONS } from '../../constants/options';

const BuyerProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    studentLocation: 'On-Campus',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Info:', formData);
    navigate('/buyer-dashboard'); // Redirect to dashboard after update
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Edit Profile</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Student Location</Form.Label>
          <Form.Control
            as="select"
            name="studentLocation"
            value={formData.studentLocation}
            onChange={handleInputChange}
          >
            {RESIDENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default BuyerProfile;
