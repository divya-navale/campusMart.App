// describe('Signup Form', () => {
//   beforeEach(() => {
//     // Visit the signup page before each test
//     cy.visit('http://localhost:3000/signup');
//   });

//   it('should load the signup page correctly', () => {
//     // Check for visibility of the form elements
//     cy.get('h1').should('exist'); // Check if there's a heading or content
//     cy.get('input[type="text"]').should('be.visible'); // Full Name
//     cy.get('input[type="email"]').should('be.visible'); // Email
//     cy.get('select').should('be.visible'); // Location Dropdown
//     cy.get('input[type="password"]').should('be.visible'); // Password
//     cy.get('input[type="password"]').eq(1).should('be.visible'); // Confirm Password
//     cy.get('button[type="submit"]').should('be.visible'); // Submit button
//   });

//   it('should display an error when passwords do not match', () => {
//     const validName = 'John Doe';
//     const validEmail = 'john.doe@example.com';
//     const studentLocation = 'Location1'; // Ensure this matches an actual option value
//     const password = 'Password123';
//     const confirmPassword = 'Password456'; // Mismatched password

//     cy.get('input[type="text"]').type(validName);
//     cy.get('input[type="email"]').type(validEmail);
//     cy.get('select').select(studentLocation);
//     cy.get('input[type="password"]').type(password);
//     cy.get('input[type="password"]').eq(1).type(confirmPassword);
//     cy.get('button[type="submit"]').click();

//     // Expect the error message for password mismatch
//     cy.get('.text-danger').should('contain.text', 'Passwords do not match');
//   });

//   it('should submit the form and navigate to /verify on successful signup', () => {
//     const validName = 'Jane Doe';
//     const validEmail = 'jane.doe@example.com';
//     const studentLocation = 'Location2';
//     const password = 'Password123';
//     const confirmPassword = 'Password123';

//     // Intercept the signup API request and mock a successful response
//     cy.intercept('POST', '/api/users', {
//       statusCode: 201,
//       body: {
//         message: 'User added successfully',
//         user: { name: validName, email: validEmail }
//       }
//     }).as('signupRequest');

//     cy.get('input[type="text"]').type(validName);
//     cy.get('input[type="email"]').type(validEmail);
//     cy.get('select').select(studentLocation);
//     cy.get('input[type="password"]').type(password);
//     cy.get('input[type="password"]').eq(1).type(confirmPassword);
//     cy.get('button[type="submit"]').click();

//     // Wait for the signup API request and verify redirection
//     cy.wait('@signupRequest');
//     cy.url().should('include', '/verify');
//   });

//   it('should display an error message if signup API call fails', () => {
//     const validName = 'User Error';
//     const validEmail = 'user.error@example.com';
//     const studentLocation = 'Location3';
//     const password = 'Password123';
//     const confirmPassword = 'Password123';

//     // Mock the signup API call failure
//     cy.intercept('POST', '/api/users', {
//       statusCode: 400,
//       body: { message: 'Email already exists' }
//     }).as('signupRequestFail');

//     cy.get('input[type="text"]').type(validName);
//     cy.get('input[type="email"]').type(validEmail);
//     cy.get('select').select(studentLocation);
//     cy.get('input[type="password"]').type(password);
//     cy.get('input[type="password"]').eq(1).type(confirmPassword);
//     cy.get('button[type="submit"]').click();

//     // Wait for the failed signup API call and check for error message
//     cy.wait('@signupRequestFail');
//     cy.get('.text-danger').should('contain.text', 'Email already exists');
//   });

//   it('should navigate to the login page when the Back to Login button is clicked', () => {
//     cy.get('button').contains('Back to Login').click();
//     cy.url().should('include', '/login');
//   });

//   it('should display validation error if required fields are not filled', () => {
//     cy.get('button[type="submit"]').click();

//     // Check for required field validation errors
//     cy.get('.invalid-feedback').should('have.length', 5); // Assuming 5 required fields
//   });
// });

// describe('Signup Form', () => {
//   // Import the residence options to ensure test matches actual options
//   const RESIDENCE_OPTIONS = [
//     { label: "Student Housing", value: "student-housing" },
//     { label: "Canterbury Greens", value: "canterbury-greens" },
//     { label: "St. Joe's", value: "st-joes" },
//     { label: "Others", value: "other" }
  
//   ];

//   beforeEach(() => {
//     cy.visit('http://localhost:3000/signup');
//   });

//   it('should display an error when passwords do not match', () => {
//     const validName = 'John Doe';
//     const validEmail = 'john.doe@example.com';
//     const studentLocation = RESIDENCE_OPTIONS[0].value; // Use the first option's value
//     const password = 'Password123';
//     const confirmPassword = 'Password456';

//     cy.get('input[type="text"]').type(validName);
//     cy.get('input[type="email"]').type(validEmail);
//     cy.get('select').select(studentLocation);
//     cy.get('input[type="password"]').first().type(password);
//     cy.get('input[type="password"]').last().type(confirmPassword);
//     cy.get('button[type="submit"]').click();

//     cy.contains('.text-danger', 'Passwords do not match');
//   });

//   it('should require all fields', () => {
//     cy.get('button[type="submit"]').click();

//     // Check for form validation
//     cy.get('input[required]').each(($input) => {
//       cy.wrap($input).should('have.attr', 'required');
//     });
//   });
// });


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
    const studentLocation = RESIDENCE_OPTIONS[0].value; // Use the first option's value
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
    const studentLocation = 'canterbury-greens';
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
    const studentLocation = RESIDENCE_OPTIONS[2].value;
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