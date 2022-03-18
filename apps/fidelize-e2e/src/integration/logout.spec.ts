import { loadData } from '../utils';
import { selectors } from '../support/selectors';

const data = loadData();

describe('Logout', () => {
  it('Should log in and log out', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.login(data.user.username, data.user.password);

    cy.get(selectors.dashboardSummary.totalCard)
      .should('be.visible');

    cy.getCookie(data.cookies.userAccess)
      .should('exist');

    cy.logout();

    cy.get(selectors.login.userInput)
      .should('exist');

    cy.getCookie(data.cookies.userAccess)
      .should('not.exist');
  });
});
