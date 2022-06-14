import { selectors } from './selectors';

Cypress.Commands.add('login', (user, password) => {
  cy.get(selectors.login.userInput).should('be.visible').type(user);

  cy.get(selectors.login.passwordInput).should('be.visible').type(password);

  cy.get(selectors.login.submitButton)
    .should('be.visible')
    .and('not.be.disabled')
    .click();
});
