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
      .wait(6000)
      .clickOnFirstMoreDetailsButton()
      .first();
    cy.get(selectors.modal.wrapper)
      .should('be.visible')
      .within(() => {
        cy.get(selectors.modal.primaryButton).click();
    });
    cy.get(selectors.opportunityDetailsList.email).type(
        'ti_homologacao@juntoseguros.com',
    );
    cy.get(selectors.opportunityDetailsList.sendButton)
      .should('be.visible')
      .click();
    cy.get(selectors.modal.title).contains(messages.moreDetailsSuccess);
  });

  it('Deve validar disclaimer de condições de produto', () => {
    cy.goToOpportunityDetailsListTab('fiscal')
      .wait(6000)
      .clickOnFirstMoreDetailsButton()
      .first();
    cy.get(selectors.modal.disclaimer).should('be.visible');
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
        .trigger('click');
    });
    cy.get(selectors.modal.wrapper)
      .should('be.visible')
      .within(() => {
        cy.get(selectors.modal.primaryButton).click();
      });
    cy.get(selectors.opportunityDetailsList.email).type(
      'ti_homologacao@juntoseguros.com',
    );
    cy.get(selectors.opportunityDetailsList.sendButton)
      .should('be.visible')
      .click();
    cy.get(selectors.modal.title).contains(messages.moreDetailsSuccess);
  });

  it('Deve navegar até a guia Trabalhista e validar seleção multipla', () => {
    cy.get(selectors.opportunityDetailsList.laborTab)
      .should('be.visible')
      .wait(6000)
      .click();
    cy.get('[data-testid=chk-6402f7d6-7018-4dc6-9ac4-40cf46517ea1][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-1ae6bd46-7441-4d47-9f95-ac05ff4074c8][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-f54b2287-0fb8-4b5e-81e8-b31ee443c4a6][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=btn-more-details-footer]').click();
    cy.get(selectors.modal.primaryButton).click();
    cy.get(selectors.opportunityDetailsList.email).type(
      'ti_homologacao@juntoseguros.com',
    );
    cy.get(selectors.opportunityDetailsList.sendButton)
      .should('be.visible')
      .click();
    cy.get(selectors.modal.title).contains(messages.moreDetailsSuccess);
  });

  it('Deve descartar seleção', () => {
    cy.get(selectors.opportunityDetailsList.laborTab)
      .should('be.visible')
      .wait(6000)
      .click();
    cy.get('[data-testid=chk-6402f7d6-7018-4dc6-9ac4-40cf46517ea1][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-1ae6bd46-7441-4d47-9f95-ac05ff4074c8][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-f54b2287-0fb8-4b5e-81e8-b31ee443c4a6][type="checkbox"]')
      .click()
      .wait(1000); 
    cy.get('[data-testid=btn-clear-selection-footer]').click();
    cy.get('.Modal_j-modal__title__KYzLP').contains('Tem certeza que deseja descartar sua seleção?');
    cy.get('[data-testid=btn-discard-selection]').click();
  });
  
  it('Deve manter seleção', () => {
    cy.get(selectors.opportunityDetailsList.laborTab)
      .should('be.visible')
      .wait(6000)
      .click();
    cy.get('[data-testid=chk-6402f7d6-7018-4dc6-9ac4-40cf46517ea1][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-1ae6bd46-7441-4d47-9f95-ac05ff4074c8][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-f54b2287-0fb8-4b5e-81e8-b31ee443c4a6][type="checkbox"]')
      .click()
      .wait(1000);  
    cy.get('[data-testid=btn-clear-selection-footer]').click();
    cy.get('.Modal_j-modal__title__KYzLP').contains('Tem certeza que deseja descartar sua seleção?');
    cy.get('[data-testid=btn-keep-selection]').click();
    cy.get('[data-testid=btn-clear-selection-footer]').should('be.visible');
  });

  it('Deve navegar até a guia Trabalhista e selecionar todas as oportunidades', () => {
    cy.get(selectors.opportunityDetailsList.laborTab)
      .should('be.visible')
      .wait(6000)
      .click();

    cy.get('[data-testid=chk-select-all]').wait(6000).check();

    cy.get('.OpportunityDetailsListFooter_opportunity-details-list-footer__selection-counter__cQ7JY')
      .contains('10 selecionados');
    
    cy.get('[data-testid=btn-clear-selection-footer]').should('be.visible');

  });

  it('Deve navegar até a guia Trabalhista e remover seleção de todas as oportunidades', () => {
    cy.get(selectors.opportunityDetailsList.laborTab)
      .should('be.visible')
      .wait(6000)
      .click();

    cy.get('[data-testid=chk-select-all]').wait(6000).check();

    cy.get('[data-testid=chk-select-all]').wait(6000).uncheck();

  });

  it('Deve navegar até a guia Civel e solicitar mais detalhes', () => {
    cy.get(selectors.opportunityDetailsList.civilTab)
      .should('be.visible')
      .wait(6000)
      .click();
    cy.get(selectors.opportunityDetailsList.listBox).within(() => {
      cy.get(selectors.opportunityDetailsList.listItemWrapper)
        .should('not.be.empty')
        .get(selectors.opportunityDetailsList.moreDetailsButton)
        .first()
        .should('not.be.empty')
        .trigger('click');
    });
    cy.get(selectors.modal.wrapper)
      .should('be.visible')
      .within(() => {
        cy.get(selectors.modal.primaryButton).click();
      });
    cy.get(selectors.opportunityDetailsList.email).type(
      'ti_homologacao@juntoseguros.com',
    );
    cy.get(selectors.opportunityDetailsList.sendButton)
      .should('be.visible')
      .click();
    cy.get(selectors.modal.title).contains(messages.moreDetailsSuccess);
  });

  it('Deve navegar até a guia Civel e validar seleção multipla', () => {
    cy.get(selectors.opportunityDetailsList.civilTab)
      .should('be.visible')
      .wait(6000)
      .click();
    cy.get('[data-testid=chk-e75f35ba-faac-4e24-a0f8-d7a8dbab9a8c][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-ca9c050b-eb2c-4e43-9857-2b143f1bb022][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-ad561e05-7e81-47d6-a41b-c9805fbfe737][type="checkbox"]')
    .click()
    .wait(1000);
    cy.get('[data-testid=btn-more-details-footer]').click();
    cy.get(selectors.modal.primaryButton).click();
    cy.get(selectors.opportunityDetailsList.email).type(
      'ti_homologacao@juntoseguros.com',
    );
    cy.get(selectors.opportunityDetailsList.sendButton)
      .should('be.visible')
      .click();
    cy.get(selectors.modal.title).contains(messages.moreDetailsSuccess);
  });

  it('Deve navegar até a guia Fiscal e validar seleção multipla', () => {
    cy.get(selectors.opportunityDetailsList.fiscalTab)
      .should('be.visible')
      .wait(6000)
      .click();
    cy.get('[data-testid=chk-9aa0f326-5bdd-45d6-a02e-d1daf0e4c536][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-8279d75e-8f0b-48c5-bb0f-83057fffbedd][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-8279d75e-8f0b-48c5-bb0f-83057fffbedd][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=btn-more-details-footer]').click();
    cy.get(selectors.modal.primaryButton).click();
    cy.get(selectors.opportunityDetailsList.email).type(
      'ti_homologacao@juntoseguros.com',
    );
    cy.get(selectors.opportunityDetailsList.sendButton)
      .should('be.visible')
      .click();
    cy.get(selectors.modal.title).contains(messages.moreDetailsSuccess);
  });

});
