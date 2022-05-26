import { loadData } from '../utils/loadData';
import { selectors } from '../support/selectors';

const { user } = loadData();

beforeEach(() => {
  cy.visit('https://fidelize-qas-2.juntoseguros.com/');

  cy.login(user.username, user.password);

  cy.get(selectors.login.submitButton).should('be.visible').click();
});

describe('Dashboard', () => {
  it('Should go to the dashboard', () => {
    cy.get(selectors.dashboardSummary.totalCard).should('be.visible');
  });

  it('Deve validar pesquisa pelo nome do tomador', () => {
    cy.intercept(
      '/squad2/fidelize-bff/api/v1/opportunities/summary/policyholders',
    ).as('getPolicyHolders');
    cy.wait('@getPolicyHolders', {
      requestTimeout: 30000,
      responseTimeout: 30000,
    });

    cy.get(selectors.dashboardSummary.searchText).type('Construtora junto', {
      delay: 200,
    });
    cy.get(selectors.dashboardSummary.searchInput)
      .should('be.visible')
      .should(
        'have.text',
        'CONSTRUTORA JUNTO SEGUROS - TESTE - 65.182.718/0001-91',
      )
      .click();

    cy.get(selectors.dashboardSummary.searchSelect).should('be.visible');

    cy.get(selectors.dashboardSummary.searchButton).click();
  });

  it('Deve validar pesquisa pelo CNPJ do tomador', () => {
    cy.intercept(
      '/squad2/fidelize-bff/api/v1/opportunities/summary/policyholders',
    ).as('getPolicyHolders');
    cy.wait('@getPolicyHolders', {
      requestTimeout: 30000,
      responseTimeout: 30000,
    });
    cy.get(selectors.dashboardSummary.searchText).type('65182718000191', {
      delay: 200,
    });

    cy.get(selectors.dashboardSummary.searchInput)
      .should('be.visible')
      .should(
        'have.text',
        'CONSTRUTORA JUNTO SEGUROS - TESTE - 65.182.718/0001-91',
      )
      .click();

    cy.get(selectors.dashboardSummary.searchSelect).should('be.visible');

    cy.get(selectors.dashboardSummary.searchButton).click();
  });

});
