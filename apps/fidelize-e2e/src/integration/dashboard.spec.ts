import { loadData } from '../utils/loadData';

const data = loadData();

describe('Dashboard', () => {
  it('Should log in', () => {
    cy.visit('/');

    cy.get('form input[name="user"]')
      .should('be.visible')
      .type(data.user.username);

    cy.get('form input[name="password"]')
      .should('be.visible')
      .type(data.user.password);

    cy.get('form button[type="submit"]')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.get('div[class^="DashboardTotalCard"]')
      .should('be.visible');
  });
});
