import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { loginUser } from './../../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await loginUser(email, password);
      console.log('Login successful!', response);
      navigate('/choose-role');
    } catch (err) {
      setError(err.message); 
      console.error(err);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="your.name@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {error && <p className="text-danger mt-3">{error}</p>}

            <div className="d-flex justify-content-center mt-4">
              <Button variant="primary" type="submit" style={{width: '30%'}}>
                Login
              </Button>
            </div>
          </Form>

          <div className="d-flex justify-content-between mt-3">
            <Link to="/forgot-password">Forgot Password?</Link>
            <Link to="/signup">Create a new account</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
