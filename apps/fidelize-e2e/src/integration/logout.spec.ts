import { loadData } from '../utils';
import { selectors } from '../support/selectors';

const { user, cookies } = loadData();

describe('Logout', () => {
  it('Should log in and log out', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.login(user.username, user.password);

    cy.get(selectors.dashboardSummary.totalCard)
      .should('be.visible');

    cy.getCookie(cookies.userAccess)
      .should('exist');

    cy.logout();

    cy.get(selectors.login.userInput)
      .should('exist');

    cy.getCookie(cookies.userAccess)
      .should('not.exist');
  });
});
