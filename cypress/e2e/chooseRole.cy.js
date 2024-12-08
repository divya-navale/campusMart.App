  describe('BuyerSellerChoice Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/choose-role');
      cy.clearLocalStorage(); // Clear localStorage before each test
  
      // Mock API responses
      cy.intercept('GET', '/api/filtered-products*', { statusCode: 200, body: [] }).as('getFilteredProducts');
      cy.intercept('GET', '/api/wishlist/*', { statusCode: 200, body: [] }).as('getWishlist');
      cy.intercept('GET', '/api/products/seller/*', { statusCode: 200, body: [] }).as('getSellerProducts');
    });
  
    Cypress.on('uncaught:exception', (err, runnable) => {
      // Prevent failing tests on uncaught exceptions
      if (err.message.includes('Cannot read properties of undefined')) {
        return false; // Return false to prevent Cypress from failing the test
      }
      throw err; // Throw other errors as usual
    });
  
    it('should display the role selection page correctly', () => {
      cy.contains('h2', 'Choose Your Role').should('be.visible');
      cy.contains('p', 'Please select if you are a Buyer or Seller').should('be.visible');
      cy.get('button').contains('I am a Buyer').should('be.visible');
      cy.get('button').contains('I am a Seller').should('be.visible');
    });
  
    it('should navigate to buyer dashboard and set role in localStorage when "I am a Buyer" is clicked', () => {
      cy.get('button').contains('I am a Buyer').click();
  
      // Verify localStorage is updated
      cy.window().then((win) => {
        expect(win.localStorage.getItem('userRole')).to.eq('buyer');
      });
  
      // Verify navigation to buyer dashboard
      cy.url().should('include', '/buyer-dashboard');
    });
  
    it('should navigate to seller dashboard and set role in localStorage when "I am a Seller" is clicked', () => {
      cy.get('button').contains('I am a Seller').click();
  
      // Verify localStorage is updated
      cy.window().then((win) => {
        expect(win.localStorage.getItem('userRole')).to.eq('seller');
      });
  
      // Verify navigation to seller dashboard
      cy.url().should('include', '/seller-dashboard');
    });
  });
  