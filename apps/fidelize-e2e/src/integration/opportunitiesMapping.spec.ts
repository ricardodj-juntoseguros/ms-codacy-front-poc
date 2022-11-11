import { loadData } from '../utils/loadData';
import { selectors } from '../support/selectors';
import { HOSTS } from '../../../../e2e/quality.json';

const { user } = loadData();

beforeEach(() => {
  cy.visit(HOSTS.FIDELIZE);
  cy.login(user.usernameDenied, user.password);

  cy.get(selectors.login.submitButton)
  .should('be.visible')
  .click();
});

describe('Mapeamento de oportunidades', () => {
  it('Deve validar o mapeamento sem oportunidades', () => {
    cy.get(':nth-child(1) > h1')
    .should('be.visible')
    .should(
        'have.text',
        'Você já imaginou prospectar novos negócios com o seu cliente?')
  });

  it('Deve solicitar novas oportunidades', () => {
 
    cy.get('.Button_j-button__container__ePge3')
    .scrollIntoView().should('be.visible')   
    .trigger('click');

    cy.get('[data-testid=input-contact-email]')
        .type('ti_homologacao@juntoseguros.com');

    cy.get('[data-testid=input-contact-question]')
        .type('GOSTARIA de ao acessar a plataforma do Fidelize e não possuir nenhum mapeamento/oportunidade disponível, ser instruído de como realizar um mapeamento e do que consiste o projeto.');

    cy.get('[data-testid=submit-btn]').click();

    cy.get('.Modal_j-modal__title__KYzLP')
    .should('be.visible')
    .should(
        'have.text',
        'Contato solicitado!')
  });
  
});