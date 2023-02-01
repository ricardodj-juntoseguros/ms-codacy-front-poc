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

  it('Deve navegar até a guia Trabalhista e validar seleção multipla', () => {
    cy.get(selectors.opportunityDetailsList.laborTab)
      .should('be.visible')
      .wait(6000)
      .click();
    cy.get('[data-testid=chk-fea30a93-ebbf-4d66-bfd4-a6102f6af358][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-fcff1cbc-056f-4c02-b67c-13b8816ba65a][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-f799fac7-12d4-4cc4-b47e-d8537962747b][type="checkbox"]')
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
    cy.get('[data-testid=chk-fea30a93-ebbf-4d66-bfd4-a6102f6af358][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-fcff1cbc-056f-4c02-b67c-13b8816ba65a][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-f799fac7-12d4-4cc4-b47e-d8537962747b][type="checkbox"]')
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
    cy.get('[data-testid=chk-fea30a93-ebbf-4d66-bfd4-a6102f6af358][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-fcff1cbc-056f-4c02-b67c-13b8816ba65a][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-f799fac7-12d4-4cc4-b47e-d8537962747b][type="checkbox"]')
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
    // cy.get(selectors.modal.title).contains(messages.moreDetailsSuccess);
  });

  it('Deve navegar até a guia Civel e validar seleção multipla', () => {
    cy.get(selectors.opportunityDetailsList.civilTab)
      .should('be.visible')
      .wait(6000)
      .click();
    cy.get('[data-testid=chk-580d35ab-1bc3-4b69-a294-998b1174a76a][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-0fbec676-48bf-4e1b-8a56-fc73653c97c2][type="checkbox"]')
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

  it('Deve navegar até a guia Fiscal e validar seleção multipla', () => {
    cy.get(selectors.opportunityDetailsList.fiscalTab)
      .should('be.visible')
      .wait(6000)
      .click();
    cy.get('[data-testid=chk-9aa0f326-5bdd-45d6-a02e-d1daf0e4c536][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-ea8b4889-0d66-4043-813a-74ecdadf4dfc][type="checkbox"]')
      .click()
      .wait(1000);
    cy.get('[data-testid=chk-c3def35c-e282-4acc-ae87-bc9e03d9d572][type="checkbox"]')
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

});
