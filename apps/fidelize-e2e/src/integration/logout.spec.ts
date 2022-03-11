import { loadData } from '../utils/loadData';

const data = loadData();

describe('Logout', () => {
  it('Should log in and log out', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.login(data.user.username, data.user.password);

    cy.get('div[class^="DashboardTotalCard"]')
      .should('be.visible');

    cy.getCookie('uac')
      .should('exist');

    cy.logout();

    cy.get('form input[name="user"]')
      .should('exist');

    cy.getCookie('uac')
      .should('not.exist');
  });
});
