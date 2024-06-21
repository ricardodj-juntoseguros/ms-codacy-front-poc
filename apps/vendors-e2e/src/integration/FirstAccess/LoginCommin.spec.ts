import { selectors } from '../../support/selectors';
import { HOSTS } from '../../../../../e2e/quality.json';

describe('Vendors - vendors-authentication - Login Common', () => {
  beforeEach(() => {
    cy.visit(`${HOSTS.VENDORS}login`);
  });

  it('display invalid access', () => {
    const email = 'squadCadastroE2EBroker@vendors.com';
    const password = 'teste';

    cy.get(selectors.login.Inputlogin).type(email);
    cy.get(selectors.login.password).type(password, {
      log: false,
    });
    cy.get(selectors.login.buttonLogin).click();
    cy.contains(
      'Os dados que você informou não estão corretos. Confira e tente novamente.',
    ).should('be.visible');
  });

  it('successfully logs in', () => {
    const email = 'squadCadastroE2EBroker@vendors.com';
    const password = 'Parana.123';

    cy.get(selectors.login.Inputlogin).type(email);
    cy.get(selectors.login.password).type(password, {
      log: false,
    });
    cy.get(selectors.login.buttonLogin).click();
  });

  it('recover access', () => {
    const email = 'squadCadastroE2E@vendors.com';

    cy.get(
      '.LoginForm_forgot_passowrd_redirect__ahOjE > .LinkButton_j-link-button__btn__z1L9g > .LinkButton_j-link-button__label__WwnRS',
    ).click();
    cy.get(selectors.login.Inputlogin).type(email);
    cy.get(selectors.login.buttonLogin).should('be.visible').click();
    cy.contains(
      'Pronto! Se o e-mail informado estiver cadastrado, você receberá instruções para recuperar seu acesso.',
    ).should('be.visible');
  });
});
