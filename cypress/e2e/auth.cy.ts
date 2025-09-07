describe('Convex Auth mocked', () => {
  beforeEach(() => {
    // Create a mock JWT token (this is a simplified version)
    const mockJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1MTIzIiwibmFtZSI6Ik1vY2sgVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.fake-signature';
    
    // Set up localStorage with proper JWT tokens
    cy.window().then((win) => {
      // Try different possible localStorage keys for Convex auth
      win.localStorage.setItem('convexAuthToken', mockJWT);
      win.localStorage.setItem('__convexAuthJWT', mockJWT);
      win.localStorage.setItem('__convexAuthRefreshToken', 'fake-refresh-token');
      
      // Also try with deployment-specific keys
      win.localStorage.setItem('__convexAuthJWT_blessed-puffin-470', mockJWT);
      win.localStorage.setItem('__convexAuthRefreshToken_blessed-puffin-470', 'fake-refresh-token');
    });

    // Intercept all requests to see what's happening
    cy.intercept('**', (req) => {
      console.log('Request:', req.method, req.url, req.body);
      req.continue();
    });
  });

  it('stays logged in and shows mocked user', () => {
    cy.visit('/dashboard');
    
    // Wait for the page to load
    cy.wait(2000);
    
    // The test should FAIL if we're redirected to auth - that means our mock isn't working
    cy.url().should('include', '/dashboard');
    cy.url().should('not.include', '/auth');
    
    // Verify we can see dashboard content
    cy.get('body').should('contain', 'Dashboard');
  });
});
