// Cypress Test Suite for Forgot Password Flow
describe('Forgot Password Flow', () => {
  const nonexistentEmail = 'nonexistentuser@mail.com';
  const validEmail = 'validuser@mail.com';

  beforeEach(() => {
    // Intercept user email lookup
    cy.intercept('GET', 'http://localhost:8080/api/users/email/*', (req) => {
      if (req.url.includes(nonexistentEmail)) {
        req.reply({
          statusCode: 404,
          body: { message: 'No user found with the given Email' },
        });
      } else if (req.url.includes(validEmail)) {
        req.reply({
          statusCode: 200,
          body: { email: validEmail },
        });
      }
    }).as('getUserByEmail');

    // Intercept OTP sending
    cy.intercept('POST', 'http://localhost:8080/api/otp/send-otp', (req) => {
      if (req.body.email === validEmail) {
        req.reply({
          statusCode: 200,
          body: { message: 'OTP sent successfully' },
        });
      } else {
        req.reply({
          statusCode: 500,
          body: { message: 'OTP sending failed' },
        });
      }
    }).as('sendOtp');

    cy.visit('http://localhost:3000/forgot-password');
  });

  it('should load the forgot password page correctly', () => {
    cy.contains('h2', 'Forgot Password').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should allow the user to enter an email', () => {
    cy.get('input[type="email"]').type(nonexistentEmail);
    cy.get('button[type="submit"]').click();
  });

  it('should show an error if the email does not exist in the system', () => {
    cy.get('input[type="email"]').type(nonexistentEmail);
    cy.get('button[type="submit"]').click();
    cy.wait('@getUserByEmail');
    cy.get('.alert-danger').should('contain.text', 'No user found with the given Email');
  });
});
