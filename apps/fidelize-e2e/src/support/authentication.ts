declare namespace Cypress {
  interface Chainable {
    login(user: string, password: string): void;
    logout(): void;
  }
}

Cypress.Commands.add('login', (user, password) => {
  cy.visit('/');

  cy.get('form input[name="user"]')
    .should('be.visible')
    .type(user);

  cy.get('form input[name="password"]')
    .should('be.visible')
    .type(password);

  cy.get('form button[type="submit"]')
    .should('be.visible')
    .and('not.be.disabled')
    .click();
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu-trigger"]')
    .should('be.visible')
    .click();

  cy.get('[data-testid="user-menu-logout-button"]')
    .should('be.visible')
    .click();  
});