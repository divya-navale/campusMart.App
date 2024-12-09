describe('RequestProduct Component', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/request-product');
  
      // Mock API responses
      cy.intercept('GET', '/api/request-product*', { statusCode: 200, body: [] }).as('getRequestedProducts');
      cy.intercept('POST', '/api/request-product', { statusCode: 201, body: { _id: 'newProductId', productName: 'Test Product', productCategory: 'Electronics', description: 'A test product' } }).as('submitProductRequest');
      cy.intercept('DELETE', '/api/request-product/*', { statusCode: 200 }).as('deleteProductRequest');
  
      // Ignore uncaught exceptions
      Cypress.on('uncaught:exception', (err) => {
        if (err.message.includes('Error fetching product requests')) {
          return false;
        }
      });
    });
  
    it('should load the requested products list', () => {
      cy.wait('@getRequestedProducts');
      cy.contains('Your Requested Products').should('be.visible');
      cy.get('.scrollable-list').should('be.visible');
    });
  
    it('should display "No requested products yet" if no products are fetched', () => {
      cy.get('.scrollable-list').contains('No requested products yet.').should('be.visible');
    });
  
    it('should allow the user to submit a new product request', () => {
      // Fill out the form
      cy.get('input[name="productName"]').type('Test Product');
      cy.get('select[name="productCategory"]').select('Electronics');
      cy.get('textarea[name="description"]').type('A test product');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Wait for the POST request and confirm the UI updates
      cy.wait('@submitProductRequest');
      cy.contains('Thank you for your request!').should('be.visible');
      cy.get('.scrollable-list').contains('Test Product').should('be.visible');
    });
  
    it('should reset the form after submission', () => {
      // Submit a product request
      cy.get('input[name="productName"]').type('Test Product');
      cy.get('select[name="productCategory"]').select('Electronics');
      cy.get('textarea[name="description"]').type('A test product');
      cy.get('button[type="submit"]').click();
      cy.wait('@submitProductRequest');
  
      // Click "Submit Another Request"
      cy.contains('Submit Another Request').click();
  
      // Ensure the form is reset
      cy.get('input[name="productName"]').should('have.value', '');
      cy.get('select[name="productCategory"]').should('have.value', '');
      cy.get('textarea[name="description"]').should('have.value', '');
    });
  
    it('should display an error message if fetching requested products fails', () => {
      // Simulate an error in fetching requested products
      cy.intercept('GET', '/api/request-product*', { statusCode: 500 }).as('getRequestedProductsError');
  
      cy.visit('http://localhost:3000/request-product');
      cy.wait('@getRequestedProductsError');
      cy.contains('Failed to load requested products').should('be.visible');
    });
  
    it('should delete a requested product', () => {
      // Mock the initial GET request with one product
      cy.intercept('GET', '/api/request-product*', {
        statusCode: 200,
        body: [{ _id: '12345', productName: 'Delete Me', productCategory: 'Books', description: 'A test product to delete' }],
      }).as('getRequestedProductsWithProduct');
  
      cy.visit('http://localhost:3000/request-product');
      cy.wait('@getRequestedProductsWithProduct');
  
      // Ensure the product is visible
      cy.contains('Delete Me').should('be.visible');
  
      // Delete the product
      cy.get('.wishlist-icon').click();
      cy.wait('@deleteProductRequest');
  
      // Confirm the product is removed from the UI
      cy.contains('Delete Me').should('not.exist');
    });
  
    it('should display an error message if deleting a product fails', () => {
      // Mock the initial GET request with one product
      cy.intercept('GET', '/api/request-product*', {
        statusCode: 200,
        body: [{ _id: '12345', productName: 'Delete Me', productCategory: 'Books', description: 'A test product to delete' }],
      }).as('getRequestedProductsWithProduct');
  
      // Mock a failed DELETE request
      cy.intercept('DELETE', '/api/request-product/*', { statusCode: 500 }).as('deleteProductRequestError');
  
      cy.visit('http://localhost:3000/request-product');
      cy.wait('@getRequestedProductsWithProduct');
  
      // Attempt to delete the product
      cy.get('.wishlist-icon').click();
      cy.wait('@deleteProductRequestError');
  
      // Confirm the error message is displayed
      cy.contains('Failed to delete product').should('be.visible');
    });
  });
  