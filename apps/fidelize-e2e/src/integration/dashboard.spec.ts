import { loadData } from '../utils/loadData';
import { selectors } from '../support/selectors';
import { HOSTS } from '../../../../e2e/quality.json';

const { user } = loadData();

beforeEach(() => {
  cy.visit(HOSTS.FIDELIZE);
  cy.login(user.username, user.password);

  cy.get(selectors.login.submitButton).should('be.visible').click();
});

describe('Dashboard', () => {

  it('Deve validar pesquisa pelo nome do tomador', () => {
    cy.get(selectors.dashboardSummary.searchText).type('TESTE', {
      delay: 1000,
    });
    cy.get(selectors.dashboardSummary.searchInput)
      .should('be.visible')
      .contains(
        'TOMADOR TESTE',
      )
      .click();

    cy.get(selectors.dashboardSummary.searchSelect).should('be.visible');

    cy.get(selectors.dashboardSummary.searchButton).click();
  });

  it('Deve validar pesquisa pelo CNPJ do tomador', () => {
    cy.get(selectors.dashboardSummary.searchText).type('91833813000118', {
      delay: 1000,
    });

    cy.get(selectors.dashboardSummary.searchInput)
      .should('be.visible')
      .should(
        'have.text',
        'TOMADOR TESTE – SQUAD DESACOPLAMENTO - 91.833.813/0001-18',
      )
      .click();

    cy.get(selectors.dashboardSummary.searchSelect).should('be.visible');

    cy.get(selectors.dashboardSummary.searchButton).click();
  });
});
