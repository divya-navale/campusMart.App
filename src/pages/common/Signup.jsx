import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { RESIDENCE_OPTIONS } from '../../constants/options';
import { signupUser } from '../../services/api';

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentlocation, setStudentLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await signupUser(fullName, email, password, studentlocation);
      console.log('User created successfully:', response);
      navigate('/verify', { state: { email: email, source: 'signup' } });
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Create Account</h2>
          <Form onSubmit={handleSignup}>
            <Form.Group controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mt-3">
              <Form.Label>PFW Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="your.name@pfw.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formStudentLocation" className="mt-3">
              <Form.Label>Student Location</Form.Label>
              <Form.Control
                as="select"
                value={studentlocation}
                onChange={(e) => setStudentLocation(e.target.value)}
                required
              >
                <option value="">Select Student Location</option>
                {RESIDENCE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formConfirmPassword" className="mt-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            {error && <p className="text-danger mt-3">{error}</p>}

            {/* Create Account Button */}
            <Button variant="primary" type="submit" className="mt-4 w-100">
              Create Account
            </Button>

            {/* Back to Login Button with spacing */}
            <Button
              variant="outline-primary"
              onClick={() => navigate('/login')}
              className="mt-3 mb-5 w-100"
            >
              Back to Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;

