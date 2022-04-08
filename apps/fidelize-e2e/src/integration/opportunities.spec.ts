import { loadData } from '../utils';
import { selectors } from '../support/selectors';

const { user, messages } = loadData();

beforeEach(() => {
  cy.visit('https://fidelize-qas-2.juntoseguros.com/');

  cy.login(user.username, user.password);

  cy.get(selectors.login.submitButton)
    .should('be.visible')
    .click();

});

describe('Opportunities', () => {
  it('Should navigate to Fiscal tab and request for more details', () => {
 
    cy.goToOpportunityDetailsListTab('fiscal')
      .clickOnFirstMoreDetailsButton().first();

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
  
  it.only('Deve validar disclaimer de condições de produto', () => {
    cy.goToOpportunityDetailsListTab('fiscal')
      .clickOnFirstMoreDetailsButton().first();

    cy.get(selectors.modal.disclaimer)
      .should('be.visible');
  });
});