import { selectors } from '../../support/selectors';
import { HOSTS } from '../../../../../e2e/quality.json';

describe('Vendors - vendors-authentication - FirstAccess Common', () => {
  beforeEach(() => {
    cy.getLink();
  });

  it('should go to first access flow', () => {
    cy.get(selectors.firstAccess.password).should('be.visible');
    cy.get(selectors.firstAccess.confirmPassword).should('be.visible');
    cy.get(selectors.firstAccess.button).should('be.disabled');
  });

  it('should run the first access flow correctly', () => {
    cy.get(selectors.firstAccess.password)
      .should('be.visible')
      .type('Parana.1a2b3');
    cy.get(selectors.firstAccess.confirmPassword)
      .should('be.visible')
      .type('Parana.1a2b3');
    cy.get(selectors.firstAccess.button).should('be.enabled').click();
    cy.url().should('eq', `${HOSTS.VENDORS}policies`);
  });

  it('password creation criteria', () => {
    const password = 'teste';

    cy.get(selectors.firstAccess.password).type(password);
    cy.get(selectors.firstAccess.confirmPassword).type(password, {
      log: false,
    });
    cy.get(selectors.firstAccess.button).should('be.disabled');
  });

  it('first access valid parameters insured', () => {
    const password = 'Parana.1a2b3';

    cy.get(selectors.firstAccess.password).type(password);
    cy.get(selectors.firstAccess.confirmPassword).type(password, {
      log: false,
    });
    cy.get(selectors.firstAccess.button).should('be.visible');
  });
});
