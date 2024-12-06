import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { RESIDENCE_OPTIONS } from '../../constants/options';
import { getUserDetails } from './../../services/api'; // Import API call function

const BuyerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get user ID from URL params
  const [formData, setFormData] = useState({
    fullName: '',
    password: '',
    studentLocation: 'On-Campus',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const user = await getUserDetails(id);
        console.log("user" + user.name)
        setFormData({
          fullName: user.name,
          password: '', // Don't pre-fill password for security reasons
          studentLocation: user.location,
        });
      } catch (err) {
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Info:', formData);
    navigate('/buyer-dashboard'); // Redirect to dashboard after update
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
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
