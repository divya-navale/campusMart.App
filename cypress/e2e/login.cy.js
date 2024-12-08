describe('Login Form', () => {
  beforeEach(() => {
    // Assuming the app is running on localhost:3000
    cy.visit('http://localhost:3000/login');
  });

  it('should load the login page correctly', () => {
    cy.get('h1').should('exist'); // Ensure the page loads with a header or some content
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('should display an error message when invalid credentials are provided', () => {
    const invalidEmail = 'test@invalid.com';
    const invalidPassword = 'incorrectpassword';
  
    cy.get('input[type="email"]').type(invalidEmail);
    cy.get('input[type="password"]').type(invalidPassword);
    cy.get('button[type="submit"]').click();
  
    // Wait for the error message to appear and assert the correct message
    cy.get('.text-danger').should('contain.text', 'User not found');
  });
  
  
  it('should navigate to /choose-role on successful login', () => {
    const validEmail = 'validuser@mail.com'; // Replace with a valid email for your test
    const validPassword = 'validpassword'; // Replace with a valid password for your test

    // Intercept the login request and mock a successful response
    cy.intercept('POST', '/api/users/verify', {
      statusCode: 200,
      body: {
        message: 'Login successful',
        token: 'dummy-token',
        verified: true,
      },
    }).as('loginRequest');

    cy.get('input[type="email"]').type(validEmail);
    cy.get('input[type="password"]').type(validPassword);
    cy.get('button[type="submit"]').click();

    // Wait for the API request and verify the redirection
    cy.wait('@loginRequest');
    cy.url().should('include', '/choose-role');
  });

  it('should display error message when API call fails', () => {
    const email = 'test@user.com';
    const password = 'wrongpassword';

    // Intercept the POST request and mock a failure response
    cy.intercept('POST', '/api/users/verify', {
      statusCode: 400,
      body: { message: 'Invalid credentials', verified: false },
    }).as('loginRequest');

    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Wait for the API request to finish and verify the error message
    cy.wait('@loginRequest');
    cy.get('.text-danger').should('contain.text', 'Invalid credentials');
  });

  it('should navigate to the forgot password page when clicked', () => {
    cy.get('a').contains('Forgot Password?').click();
    cy.url().should('include', '/forgot-password');
  });

  it('should navigate to the signup page when clicked', () => {
    cy.get('a').contains('Create a new account').click();
    cy.url().should('include', '/signup');
  });
});
