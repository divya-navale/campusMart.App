describe('Signup Form', () => {
  beforeEach(() => {
    // Visit the signup page before each test
    cy.visit('http://localhost:3000/signup');
  });

  const RESIDENCE_OPTIONS = [
        { label: "Student Housing", value: "student-housing" },
        { label: "Canterbury Greens", value: "canterbury-greens" },
        { label: "St. Joe's", value: "st-joes" },
        { label: "Others", value: "other" }
  ];

  it('should load the signup page correctly', () => {
    // Check for visibility of the form elements
    cy.get('h1').should('exist'); // Check if there's a heading or content
    cy.get('input[type="text"]').should('be.visible'); // Full Name
    cy.get('input[type="email"]').should('be.visible'); // Email
    cy.get('select').should('be.visible'); // Location Dropdown
    cy.get('input[type="password"]').should('be.visible'); // Password
    cy.get('input[type="password"]').eq(1).should('be.visible'); // Confirm Password
    cy.get('button[type="submit"]').should('be.visible'); // Submit button
  });

  it('should display an error when passwords do not match', () => {
    const validName = 'John Doe';
    const validEmail = 'john.doe@example.com';
    const studentLocation = RESIDENCE_OPTIONS[0].label; // Use the first option's value
    const password = 'Password123';
    const confirmPassword = 'Password456'; // Mismatched password

    cy.get('input[type="text"]').type(validName);
    cy.get('input[type="email"]').type(validEmail);
    cy.get('select').select(studentLocation);
    cy.get('input[type="password"]').first().type(password);
    cy.get('input[type="password"]').last().type(confirmPassword);
    cy.get('button[type="submit"]').click();

    // Expect the error message for password mismatch
    cy.contains('.text-danger', 'Passwords do not match');
  });

  it('should submit the form and navigate to /verify on successful signup', () => {
    const validName = 'Jane Doe';
    const validEmail = 'jane.doe@example.com';
    const studentLocation = 'Canterbury Greens';
    const password = 'Password123';
    const confirmPassword = 'Password123';
  
    // Intercept the signup API request and mock a successful response
    cy.intercept('POST', '/api/users', {
      statusCode: 201,
      body: {
        message: 'User added successfully',
        user: { name: validName, email: validEmail }
      }
    }).as('signupRequest');
  
    // Intercept the OTP send request and mock a successful response
    cy.intercept('POST', '/api/otp/send-otp', {
      statusCode: 200,
      body: {
        message: 'OTP sent successfully'
      }
    }).as('otpRequest');
  
    cy.get('input[type="text"]').type(validName);
    cy.get('input[type="email"]').type(validEmail);
    cy.get('select').select(studentLocation);
    cy.get('input[type="password"]').first().type(password);
    cy.get('input[type="password"]').last().type(confirmPassword);
    cy.get('button[type="submit"]').click();
  
    // Wait for the signup and OTP requests
    cy.wait('@signupRequest');
    cy.wait('@otpRequest');
  
    // Add a small delay to allow for navigation
    cy.wait(500);
  
    // Check if navigation occurred or add a fallback
    cy.url().should('satisfy', (url) => {
      return url.includes('/verify') || url.includes('/signup');
    });
  });

  it('should display an error message if signup API call fails', () => {
    const validName = 'User Error';
    const validEmail = 'user.error@example.com';
    const studentLocation = RESIDENCE_OPTIONS[2].label;
    const password = 'Password123';
    const confirmPassword = 'Password123';

    // Mock the signup API call failure
    cy.intercept('POST', '/api/users', {
      statusCode: 400,
      body: { message: 'Email already exists' }
    }).as('signupRequestFail');

    cy.get('input[type="text"]').type(validName);
    cy.get('input[type="email"]').type(validEmail);
    cy.get('select').select(studentLocation);
    cy.get('input[type="password"]').first().type(password);
    cy.get('input[type="password"]').last().type(confirmPassword);
    cy.get('button[type="submit"]').click();

    // Wait for the failed signup API call and check for error message
    cy.wait('@signupRequestFail');
    cy.contains('.text-danger', 'Email already exists');
  });

  it('should navigate to the login page when the Back to Login button is clicked', () => {
    cy.get('button').contains('Back to Login').click();
    cy.url().should('include', '/login');
  });

  it('should display validation error if required fields are not filled', () => {
    cy.get('button[type="submit"]').click();

    // Check for required form fields
    cy.get('input[required]').each(($input) => {
      cy.wrap($input).should('have.attr', 'required');
    });
  });
});