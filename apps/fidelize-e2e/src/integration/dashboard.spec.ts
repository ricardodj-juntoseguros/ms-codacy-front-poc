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
  it('Deve validar o dashboard', () => {
    cy.get(selectors.dashboardSummary.totalCard).should('be.visible');
  });

  it('Deve validar pesquisa pelo nome do tomador', () => {
    cy.get(selectors.dashboardSummary.searchText).type('DEXCO S.A', {
      delay: 1000,
    });
    cy.get(selectors.dashboardSummary.searchInput)
      .should('be.visible')
      .should(
        'have.text',
        'DEXCO S.A - 97.837.181/0001-47',
      )
      .click();

    cy.get(selectors.dashboardSummary.searchSelect).should('be.visible');

    cy.get(selectors.dashboardSummary.searchButton).click();
  });

  it('Deve validar pesquisa pelo CNPJ do tomador', () => {
    cy.get(selectors.dashboardSummary.searchText).type('97837181000147', {
      delay: 1000,
    });

    cy.get(selectors.dashboardSummary.searchInput)
      .should('be.visible')
      .should(
        'have.text',
        'DEXCO S.A - 97.837.181/0001-47',
      )
      .click();

    cy.get(selectors.dashboardSummary.searchSelect).should('be.visible');

    cy.get(selectors.dashboardSummary.searchButton).click();
  });
});
