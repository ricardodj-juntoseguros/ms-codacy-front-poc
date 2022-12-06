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
    // cy.get(selectors.modal.title).contains(messages.moreDetailsSuccess);
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
    // cy.get(selectors.modal.title).contains(messages.moreDetailsSuccess);
  });

  it('Deve navegar até a guia Trabalhista e validar seleção de multipla', () => {
    cy.get(selectors.opportunityDetailsList.laborTab)
      .should('be.visible')
      .wait(6000)
      .click();
    cy.get(
      '[data-testid=chk-6402f7d6-7018-4dc6-9ac4-40cf46517ea1][type="checkbox"]',
    )
      .click()
      .wait(1000);
    cy.get(
      '[data-testid=chk-1ae6bd46-7441-4d47-9f95-ac05ff4074c8][type="checkbox"]',
    )
      .click()
      .wait(1000);
    cy.get(
      '[data-testid=chk-f54b2287-0fb8-4b5e-81e8-b31ee443c4a6][type="checkbox"]',
    )
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
    // cy.get(selectors.modal.title).contains(messages.moreDetailsSuccess);
  });

  it('Deve descartar seleção', () => {
    cy.get(selectors.opportunityDetailsList.laborTab)
      .should('be.visible')
      .wait(6000)
      .click();
      cy.get(
        '[data-testid=chk-6402f7d6-7018-4dc6-9ac4-40cf46517ea1][type="checkbox"]',
      )
        .click()
        .wait(1000);
      cy.get(
        '[data-testid=chk-1ae6bd46-7441-4d47-9f95-ac05ff4074c8][type="checkbox"]',
      )
        .click()
        .wait(1000);
      cy.get(
        '[data-testid=chk-f54b2287-0fb8-4b5e-81e8-b31ee443c4a6][type="checkbox"]',
      )
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
      cy.get(
        '[data-testid=chk-6402f7d6-7018-4dc6-9ac4-40cf46517ea1][type="checkbox"]',
      )
        .click()
        .wait(1000);
      cy.get(
        '[data-testid=chk-1ae6bd46-7441-4d47-9f95-ac05ff4074c8][type="checkbox"]',
      )
        .click()
        .wait(1000);
      cy.get(
        '[data-testid=chk-f54b2287-0fb8-4b5e-81e8-b31ee443c4a6][type="checkbox"]',
      )
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

    cy.get('.OpportunityDetailsListFooter_opportunity-details-list-footer__selection-counter__cQ7JY').contains('10 selecionados');
    
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
  });

});
