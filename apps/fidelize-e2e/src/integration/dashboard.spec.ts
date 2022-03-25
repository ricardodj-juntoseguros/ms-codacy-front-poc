import { loadData } from '../utils/loadData';
import { selectors } from '../support/selectors';

const { user } = loadData();

describe('Dashboard', () => {
  it('Should go to the dashboard', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.login(user.username, user.password);

    cy.get(selectors.dashboardSummary.totalCard)
      .should('be.visible');
  });
});
