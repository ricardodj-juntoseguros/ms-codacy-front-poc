import { URL, USERS } from '../../../../e2e/quality.json';

Cypress.Commands.add('getLink', () => {
  cy.request({
    method: 'GET',
    url: `${URL.MS_MIDDLEWARE_VENDORS}/api/v1/user/create/password?email=${USERS.VENDORS_SQUAD_CADASTRO}&isFirstAccess=true`,
  }).then(async resp => {
    cy.visit(resp.body);
  });
});
