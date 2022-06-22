import { loadData } from '../utils';
import { selectors } from '../support/selectors';
import { HOSTS } from '../../../../e2e/quality.json';

const { user, messages } = loadData();

beforeEach(() => {
  cy.visit(HOSTS.FIDELIZE);

  cy.login(user.username, user.password);

  cy.get(selectors.login.submitButton).should('be.visible').click();
});

describe('Opportunities', () => {
  it('Deve navegar até a guia Fiscal e solicitar mais detalhes', () => {
    cy.goToOpportunityDetailsListTab('fiscal')
      .clickOnFirstMoreDetailsButton()
      .first();

    cy.get(selectors.modal.wrapper)
      .should('be.visible')
      .within(() => {
        cy.get(selectors.modal.primaryButton).click();
      });

    cy.get(selectors.modal.title).contains(messages.moreDetailsSuccess);
  });

  it('Deve validar disclaimer de condições de produto', () => {
    cy.goToOpportunityDetailsListTab('fiscal')
      .clickOnFirstMoreDetailsButton()
      .first();

    cy.get(selectors.modal.disclaimer).should('be.visible');
  });

  it('Deve validar dados da trabalhista', () => {
    cy.get(selectors.opportunityDetailsList.laborTab)
    .should('be.visible')
    .wait(6000)
    .click();

    cy.get(
      '.ModalitySummary_modality-summary__wrapper__c_k1B > :nth-child(1)',
    ).should('be.visible');

    cy.get(
      '.ModalitySummary_modality-summary__wrapper__c_k1B > :nth-child(2)',
    ).should('be.visible');
  });

  it('Deve navegar até a guia Trabalhista e solicitar mais detalhes', () => {

    cy.get(selectors.opportunityDetailsList.laborTab)
      .should('be.visible')
      .wait(6000)
      .click();

    cy.get(selectors.opportunityDetailsList.listBox).within(() => {
      cy.get(selectors.opportunityDetailsList.listItemWrapper)
        .should('not.be.empty')
        .get(selectors.opportunityDetailsList.moreDetailsButton)
        .first()
        .should('not.be.empty')
        .click();
    });

    cy.get(selectors.modal.wrapper)
      .should('be.visible')
      .within(() => {
        cy.get(selectors.modal.primaryButton).click();
    });

    cy.get(selectors.opportunityDetailsList.email)
      .type('ti_homologacao@juntoseguros.com');

    cy.get(selectors.opportunityDetailsList.sendButton)
      .should('be.visible')
      .click();

    cy.get(selectors.modal.title)
      .contains(messages.moreDetailsSuccess);
  });
});
