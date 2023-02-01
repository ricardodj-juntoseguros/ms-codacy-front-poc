import { loadData } from '../utils/loadData';
import { selectors } from '../support/selectors';
import { HOSTS } from '../../../../e2e/quality.json';

const { user } = loadData();

beforeEach(() => {
  cy.visit(HOSTS.FIDELIZE);
  cy.login(user.username, user.password);

  cy.get(selectors.login.submitButton).should('be.visible').click();

  cy.get(selectors.opportunityDetailsList.laborTab)
    .should('be.visible')
    .wait(6000)
    .click();

    cy.contains('.LinkButton_j-link-button__label__WwnRS', /^Filtro/).click({force: true});  
  
});

describe('Filtros', () => {
  it('Deve filtrar por Relevância "Alta"', () => {
    
    cy.get('[data-testid=labor-relevance-filter]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-3]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-apply-btn]').click();

    cy.contains(
      '.OpportunityDetailsListItem_opportunity-details-listitem__relevance-tag__2hKKh',
      /^Alta/,
    ).should('not.be.empty');
  });

  it('Deve filtrar por Relevância "Média"', () => {
    cy.get('[data-testid=labor-relevance-filter]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-2]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-apply-btn]').click();

    cy.contains(
      '.OpportunityDetailsListItem_opportunity-details-listitem__relevance-tag__2hKKh',
      /^Média/,
    ).should('not.be.empty');
  });

  it('Deve filtrar por Relevância "Baixa"', () => {
    cy.get('[data-testid=labor-relevance-filter]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-1]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-apply-btn]').click();

    cy.contains(
      '.OpportunityDetailsListItem_opportunity-details-listitem__relevance-tag__2hKKh',
      /^Baixa/,
    ).should('not.be.empty');
  });

  it('Deve filtrar por Relevância "Expirada"', () => {
    cy.get('[data-testid=labor-relevance-filter]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-0]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-apply-btn]').click();

    cy.contains(
      '.OpportunityDetailsListItem_opportunity-details-listitem__relevance-tag__2hKKh',
      /^Expirada/,
    ).should('not.be.empty');
  });

  it('Deve filtrar por Tipo "Nova Emissão"', () => {

    cy.get('[data-testid=labor-category-filter]').click();

    cy.get('[data-testid=labor-category-filter-chk-multi-6]').click();

    cy.get('[data-testid=labor-category-filter-chk-multi-apply-btn]').click();

    cy.contains(
      '.OpportunityDetailsListItem_opportunity-details-listitem__label__2Ieq6',
      /^Nova emissão/,
    ).should('not.be.empty');
    
  });

  it('Deve filtrar por Tipo "Renovação"', () => {

    cy.get('[data-testid=labor-category-filter]').click();

    cy.get('[data-testid=labor-category-filter-chk-multi-1]').click();

    cy.get('[data-testid=labor-category-filter-chk-multi-apply-btn]').click();

    cy.contains(
      '.OpportunityDetailsListItem_opportunity-details-listitem__label__2Ieq6',
      /^Renovação/,
    ).should('not.be.empty');
  });

  it('Deve filtrar Valor IS, com valor minimo vazio e máximo preenchido', () => {
    cy.get('[data-testid=labor-securityAmount-filter]').click();

    cy.get('[data-testid=max-security-amount-input]').type('9000');

    cy.get('[data-testid=security-amount-filter-apply-btn]').click();

    cy.get(
      '.OpportunityDetailsListItem_opportunity-details-listitem__label__2Ieq6',
    ).should('not.be.empty');
  });

  it('Deve filtrar Valor IS, com valor minimo preenchido e máximo vazio', () => {
    cy.get('[data-testid=labor-securityAmount-filter]').click();

    cy.get('[data-testid=min-security-amount-input]').type('9000');

    cy.get('[data-testid=security-amount-filter-apply-btn]').click();

    cy.get(
      '.OpportunityDetailsListItem_opportunity-details-listitem__label__2Ieq6',
    ).should('not.be.empty');
  });

  it('Deve filtrar Valor IS, com valor minimo e máximo preenchidos', () => {
    cy.get('[data-testid=labor-securityAmount-filter]').click();

    cy.get('[data-testid=min-security-amount-input]').type('8000');

    cy.get('[data-testid=max-security-amount-input]').type('9000');

    cy.get('[data-testid=security-amount-filter-apply-btn]').click();

    cy.get(
      '.OpportunityDetailsListItem_opportunity-details-listitem__label__2Ieq6',
    ).should('not.be.empty');
  });

  it('Deve filtrar Valor IS, com valor minimo maior que o máximo', () => {
    cy.get('[data-testid=labor-securityAmount-filter]').click();

    cy.get('[data-testid=min-security-amount-input]').type('9000');

    cy.get('[data-testid=max-security-amount-input]').type('8000');

    cy.get('[data-testid=security-amount-filter-apply-btn]').click();

    cy.get('.InputBase_j-input__error__bFwYb').should(
      'have.text',
      'O valor máximo precisa ser maior que o valor mínimo',
    );
  });

  it('Deve filtrar Data de mapeamento, com data inicial preenchida e data final vazia', () => {

    cy.get('[data-testid=labor-mappingDate-filter]').click();

    cy.get('[data-testid=min-mapping-date-input]').type('20102021');

    cy.get('[data-testid=mapping-date-filter-apply-btn]').click();

    cy.get(
      '.OpportunityDetailsListItem_opportunity-details-listitem__label__2Ieq6',
    ).should('not.be.empty');
  });

  it('Deve filtrar Data de mapeamento, com data inicial vazia e data final preenchida', () => {
    cy.get('[data-testid=labor-mappingDate-filter]').click();

    cy.get('[data-testid=max-mapping-date-input]').type('20102021');

    cy.get('[data-testid=mapping-date-filter-apply-btn]').click();

    cy.get(
      '.OpportunityDetailsListItem_opportunity-details-listitem__label__2Ieq6',
    ).should('not.be.empty');
  });

  it('Deve filtrar Data de mapeamento, com data inicial e final preenchidos', () => {
    cy.get('[data-testid=labor-mappingDate-filter]').click();

    cy.get('[data-testid=min-mapping-date-input]').type('20102021');

    cy.get('[data-testid=max-mapping-date-input]').type('20102021');

    cy.get('[data-testid=mapping-date-filter-apply-btn]').click();

    cy.get(
      '.OpportunityDetailsListItem_opportunity-details-listitem__label__2Ieq6',
    ).should('not.be.empty');
  });

  it('Deve filtrar Data de mapeamento, com data final maior que data inicial', () => {
    cy.get('[data-testid=labor-mappingDate-filter]').click();

    cy.get('[data-testid=min-mapping-date-input]').type('20102021');

    cy.get('[data-testid=max-mapping-date-input]').type('19102021');

    cy.get('[data-testid=mapping-date-filter-apply-btn]').click();

    cy.get('.InputBase_j-input__error__bFwYb').should(
      'have.text',
      'A data final deve ser posterior a data inicial!',
    );
  });

  it('Deve Limpar a seleção', () => {
    cy.get('[data-testid=labor-relevance-filter]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-2]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-1]').click();

    cy.get('[data-testid=labor-relevance-filter-chk-multi-apply-btn]').click();

    cy.get('[data-testid=btn-clear-all-filters]').click();
  });
});
