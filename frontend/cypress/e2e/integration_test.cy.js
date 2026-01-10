describe('Integration and Final Stability Test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should allow a user to add a cosmetic item and verify D-Day accuracy', () => {
    // UI/UX: Check if entry point is visible
    cy.get('[data-testid="add-product-btn"]').should('be.visible').click();

    // Input Data
    cy.get('input[name="productName"]').type('Final Test Cream');
    
    // Mobile DatePicker Optimization Check
    cy.get('input[name="expiryDate"]').type('2025-12-31'); 
    
    cy.get('button[type="submit"]').click();

    // Verify List and Calculation
    cy.contains('Final Test Cream').should('exist');
    cy.get('.d-day-badge').invoke('text').then((text) => {
      expect(text).to.match(/D-\d+/); // Verify format matches D-Day calculation
    });
  });

  it('should maintain layout across different resolutions', () => {
    cy.viewport('iphone-xr');
    cy.get('.navbar').should('be.visible');
    cy.viewport(1920, 1080);
    cy.get('.navbar').should('be.visible');
  });
});