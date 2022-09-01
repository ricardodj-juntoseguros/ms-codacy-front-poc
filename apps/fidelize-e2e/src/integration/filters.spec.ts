import { loadData } from '../utils/loadData';
import { selectors } from '../support/selectors';
import { HOSTS } from '../../../../e2e/quality.json';

const { user } = loadData();

beforeEach(() => {
  cy.visit(HOSTS.FIDELIZE);
  cy.login(user.username, user.password);

  cy.get(selectors.login.submitButton)
    .should('be.visible')
    .click();

  cy.get(selectors.opportunityDetailsList.laborTab)
    .should('be.visible')
    .wait(6000)
    .click();

  cy.get('.OpportunityDetailsListFilters_opportunity-details-list-filters__wrapper__dH-8P > :nth-child(1) > .LinkButton_j-link-button__btn__3ltGA')
    .click();
       
});

describe('Filtros', () => {
  it('Deve filtrar por Relevância "Alta"', () => { 
    
    cy.get('[data-testid=labor-relevance-filter]')
      .click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-3]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-apply-btn]').click();

    cy.contains('.OpportunityDetailsListItem_opportunity-details-listitem__relevance-tag__2hKKh', /^Alta/);

  });

  it('Deve filtrar por Relevância "Média"', () => {

    cy.get('[data-testid=labor-relevance-filter]')
      .click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-2]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-apply-btn]').click();

    cy.contains('.OpportunityDetailsListItem_opportunity-details-listitem__relevance-tag__2hKKh', /^Média/);

  });

  it('Deve filtrar por Relevância "Baixa"', () => {

    cy.get('[data-testid=labor-relevance-filter]')
      .click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-1]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-apply-btn]').click();

    cy.contains('.OpportunityDetailsListItem_opportunity-details-listitem__relevance-tag__2hKKh', /^Baixa/);

  });

  it('Deve filtrar por Relevância "Expirada"', () => {

    cy.get('[data-testid=labor-relevance-filter]')
      .click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-0]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-apply-btn]').click();

    cy.contains('.OpportunityDetailsListItem_opportunity-details-listitem__relevance-tag__2hKKh', /^Expirada/);
      
  });

  it.only('Deve filtrar por Tipo "Depósito judicial"', () => {

    cy.get('[data-testid=labor-category-filter]')
      .click(); 

    cy.get('[data-testid=labor-category-filter-chk-multi-3]').click();

    cy.get('[data-testid=labor-category-filter-chk-multi-apply-btn]').click();

    cy.contains('.OpportunityDetailsListItem_opportunity-details-listitem__label__2Ieq6', /^Depósito judicial/);

  });

  it('Deve filtrar por Tipo "Nova Emissão"', () => {

    cy.get('[data-testid=labor-category-filter]')
      .click(); 

    cy.get('[data-testid=labor-category-filter-chk-multi-6]').click();

    cy.get('[data-testid=labor-category-filter-chk-multi-apply-btn]').click();

    cy.contains('.OpportunityDetailsListItem_opportunity-details-listitem__label__2Ieq6', /^Nova emissão/);

  });

  it('Deve Limpar a seleção', () => {

    cy.get('[data-testid=labor-relevance-filter-chk-multi-2]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-1]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-apply-btn]').click();

    cy.get('[data-testid=btn-clear-all-filters]').click();
      
  }); 

});