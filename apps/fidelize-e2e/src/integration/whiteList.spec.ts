import { loadData } from '../utils/loadData';
import { selectors } from '../support/selectors';
import { HOSTS } from '../../../../e2e/quality.json';

const { user } = loadData();

beforeEach(() => {
  cy.visit(HOSTS.FIDELIZE);
});

describe('White List', () => {
  it('Deve visualizar mapeamento de oportunidades', () => {
    cy.login(user.username, user.password);

    cy.get(selectors.login.submitButton)
    .should('be.visible')
    .click()
    .wait(9000);

    cy.get('[data-testid=dashboard-opportunity-text]')
    .should('be.visible')
    .should(
      'have.text',
      'Veja as oportunidades judiciais dos seus clientes')
  });

  it('Deve não visualizar mapeamento de oportunidades', () => {
    cy.login(user.usernameBlackList, user.password);

    cy.get(selectors.login.submitButton)
    .should('be.visible')
    .click()
    .wait(9000);

    cy.get('.DashboardHeader_dashboard-header__title__HFNNi')
    .should('be.visible')
    .should(
      'have.text',
      'Fidelize Dashboard')
  });
  
  
});