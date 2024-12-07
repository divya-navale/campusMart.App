import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const SessionExpired = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Session Expired</h1>
      <p>Your session has expired. Please log in again to continue.</p>
      <div className="text-center mt-3">
        <Button variant="link" onClick={() => navigate('/login')}>
          Back to Login
        </Button>
      </div>
    </div>
  );
};

export default SessionExpired;
