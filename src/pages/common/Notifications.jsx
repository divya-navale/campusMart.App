import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';

const Notifications = () => {
  const notifications = [
    { id: 1, text: "Your request has been approved!" },
    { id: 2, text: "New product added to your wishlist." },
    { id: 3, text: "Seller responded to your query." },
  ];

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Notifications</h2>
      <ListGroup>
        {notifications.map((notification) => (
          <ListGroup.Item key={notification.id}>{notification.text}</ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Notifications;
