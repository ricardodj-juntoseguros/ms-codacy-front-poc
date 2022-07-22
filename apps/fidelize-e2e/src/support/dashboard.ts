import { selectors } from './selectors';

Cypress.Commands.add('goToOpportunityDetailsListTab', tab => {
  const tabs: any = {
    labor: selectors.opportunityDetailsList.laborTab,
    fiscal: selectors.opportunityDetailsList.fiscalTab,
    civil: selectors.opportunityDetailsList.civilTab,
  };

  return cy.get(tabs[tab]).should('be.visible').click();
});

Cypress.Commands.add('clickOnFirstMoreDetailsButton', () => {
  return cy.get(selectors.opportunityDetailsList.listBox).within(() => {
    cy.get(selectors.opportunityDetailsList.listItemWrapper)
      .should('not.be.empty')
      .get(selectors.opportunityDetailsList.moreDetailsButton)
      .first()
      .should('not.be.empty')
      .trigger('click');
  });
});
