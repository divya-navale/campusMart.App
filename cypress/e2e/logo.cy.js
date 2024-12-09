// http://localhost:3000

describe('Logo Component', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000'); // Start on the login page or a route where the logo is present
  
      // Mock API responses to prevent 401 errors
      cy.intercept('GET', '/api/filtered-products*', { statusCode: 200, body: [] }).as('getFilteredProducts');
      cy.intercept('GET', '/api/wishlist/*', { statusCode: 200, body: [] }).as('getWishlist');
      cy.intercept('GET', '/api/products/seller/*', { statusCode: 200, body: [] }).as('getSellerProducts');
  
      // Ignore specific uncaught exceptions
      Cypress.on('uncaught:exception', (err) => {
        if (err.message.includes('Cannot read properties of undefined')) {
          return false; // Prevent test from failing
        }
      });
    });
  
    it('should display the logo on applicable routes', () => {
      const visibleRoutes = [
        'http://localhost:3000/login',
        'http://localhost:3000/signup',
        'http://localhost:3000/forgot-password',
        'http://localhost:3000/choose-role',
      ];
  
      visibleRoutes.forEach((route) => {
        cy.visit(route);
        cy.get('img[alt="CampusMart Logo"]').should('be.visible');
      });
    });
  
    it('should not display the logo on hidden routes', () => {
      const hiddenRoutes = [
        'http://localhost:3000/buyer-notifications',
        'http://localhost:3000/seller-notifications',
        'http://localhost:3000/request-product',
        'http://localhost:3000/wishlist',
        'http://localhost:3000/notifications',
        'http://localhost:3000/seller-dashboard',
      ];
  
      hiddenRoutes.forEach((route) => {
        cy.visit(route);
        cy.get('img[alt="CampusMart Logo"]').should('not.exist');
      });
    });
  
    it('should navigate to seller dashboard when logo is clicked by a seller', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('userRole', 'seller');
      });
  
      cy.visit('http://localhost:3000'); // Visit a route where the logo is visible
      cy.get('img[alt="CampusMart Logo"]').click();
      cy.url().should('include', '/seller-dashboard'); // Verify navigation to seller dashboard
    });
  
    it('should not navigate anywhere when logo is clicked without a role', () => {
      cy.window().then((win) => {
        win.localStorage.removeItem('userRole'); // Ensure no role is set
      });
  
      cy.visit('http://localhost:3000'); // Visit a route where the logo is visible
      cy.get('img[alt="CampusMart Logo"]').click();
      cy.url().should('eq', 'http://localhost:3000/'); // Verify no navigation occurs
    });
  
    it('should change cursor style based on user role', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('userRole', 'buyer');
      });
  
      cy.visit('http://localhost:3000'); // Visit a route where the logo is visible
      cy.get('img[alt="CampusMart Logo"]').should('have.css', 'cursor', 'pointer');
  
      cy.window().then((win) => {
        win.localStorage.removeItem('userRole'); // Remove role
      });
  
      cy.visit('http://localhost:3000'); // Visit a route where the logo is visible
      cy.get('img[alt="CampusMart Logo"]').should('have.css', 'cursor', 'default');
    });
  });

