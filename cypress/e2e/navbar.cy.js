describe('NavbarComponent Tests', () => {
    beforeEach(() => {
      // Set up localStorage for a buyer role
      localStorage.setItem('userRole', 'buyer');
      localStorage.setItem('token', 'mock.valid.jwt.token');
  
      // Intercept API requests
      cy.intercept('GET', '/api/filtered-products*', { statusCode: 200, body: { products: [] } }).as('filteredProducts');
      cy.intercept('GET', '/api/wishlist/*', { statusCode: 200, body: { wishlist: { products: [] } } }).as('wishlist');
  
      // Log intercept registration
      cy.log('Intercepts registered for filteredProducts and wishlist');
  
      // Visit the buyer dashboard
      cy.visit('http://localhost:3000/buyer-dashboard');
    });
  
    it('should display the logo and navigate to the dashboard when clicked', () => {
      cy.get('.navbar-brand-logo') // Find the logo
        .should('be.visible') // Ensure it is visible
        .click(); // Simulate a click
  
      // Verify the URL includes '/buyer-dashboard'
      cy.url().should('include', '/buyer-dashboard');
    });
  
    it('should hide buyer-specific links for sellers', () => {
      // Set userRole to 'seller' and reload the page
      localStorage.setItem('userRole', 'seller');
      cy.reload();
  
      // Verify buyer-specific links are not present
      cy.get('.nav-icon-container').contains('Wishlist').should('not.exist');
      cy.get('.nav-icon-container').contains('Request Product').should('not.exist');
    });
  
    it('should render the NavbarComponent on allowed routes', () => {
      cy.get('.navbar') // Find the navbar
        .should('be.visible'); // Ensure it is visible
    });
  
    it('should hide the NavbarComponent on restricted routes', () => {
      // Navigate to a restricted route
      cy.visit('http://localhost:3000/login');
  
      // Verify the Navbar is not visible
      cy.get('.navbar').should('not.exist');
    });
  });
  