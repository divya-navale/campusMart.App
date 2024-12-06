import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { getUserByEmail, sendOtp } from '../../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await getUserByEmail(email);
      console.log(response);
      const otpResponse = await sendOtp(email);
      if(otpResponse.status == 200){
        console.log("OTP sent to your email address");
      }
      navigate('/verify', { state: { email: email, source: 'forgot-password' } });
    } catch (err) {
      setError('No user found with the given Email');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Forgot Password</h2>
          <p className="text-center">Enter your email to reset your password.</p>
          <Form onSubmit={handleForgotPassword}>
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

            {error && <div className="alert alert-danger">{error}</div>}
            
            <Button variant="primary" type="submit" className="mt-4">
              Verify your account
            </Button>
          </Form>

          <div className="text-center mt-3">
            <Button variant="link" onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
