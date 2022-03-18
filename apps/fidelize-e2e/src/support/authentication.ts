import { selectors } from './selectors';

Cypress.Commands.add('login', (user, password) => {
  cy.visit('/');

  cy.get(selectors.login.userInput)
    .should('be.visible')
    .type(user);

  cy.get(selectors.login.passwordInput)
    .should('be.visible')
    .type(password);

  cy.get(selectors.login.submitButton)
    .should('be.visible')
    .and('not.be.disabled')
    .click();
});

Cypress.Commands.add('logout', () => {
  cy.get(selectors.userMenu.userMenuButton)
    .should('be.visible')
    .click();

  cy.get(selectors.userMenu.logoutButton)
    .should('be.visible')
    .click();
});