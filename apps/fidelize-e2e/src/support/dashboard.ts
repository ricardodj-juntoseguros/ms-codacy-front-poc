import { selectors } from './selectors';

Cypress.Commands.add('goToOpportunityDetailsListTab', (tab) => {
  const tabs: any = {
    labor: selectors.opportunityDetailsList.laborTab,
    fiscal: selectors.opportunityDetailsList.fiscalTab,
    civil: selectors.opportunityDetailsList.civilTab
  };
  
  return (
    cy.get(tabs[tab])
      .should('be.visible')  
      .click()
  );
});