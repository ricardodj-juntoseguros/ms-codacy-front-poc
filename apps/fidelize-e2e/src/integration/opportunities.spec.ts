import { loadData } from '../utils';
import { selectors } from '../support/selectors';

const { user, messages } = loadData();

describe('Opportunities', () => {
  it('Should navigate to Fiscal tab and request for more details', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.login(user.username, user.password);

    cy.goToOpportunityDetailsListTab('fiscal')
      .clickOnFirstMoreDetailsButton();

    cy.get(selectors.modal.wrapper)
      .should('be.visible')
      .within(() => {
        cy.get(selectors.modal.primaryButton)
          .click();
      });

    cy.get(selectors.modal.icon)
      .should('be.visible');

    cy.get(selectors.modal.title)
      .contains(messages.moreDetailsSuccess);
  });
});