import { loadData } from '../utils';
import { selectors } from '../support/selectors';

const data = loadData();

describe('Opportunities', () => {
  it('Should navigate to Fiscal tab', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.login(data.user.username, data.user.password);

    cy.goToOpportunityDetailsListTab('fiscal')
      .get(selectors.opportunityDetailsList.listBox)
      .within(() => {
        cy.get(selectors.opportunityDetailsList.listItemWrapper)
          .should('not.be.empty');
      });
  });
});