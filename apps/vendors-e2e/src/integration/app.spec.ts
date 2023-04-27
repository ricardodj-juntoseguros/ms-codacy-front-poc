import { getTitle } from '../support/app.po';

describe('vendors', () => {
  beforeEach(() => cy.visit('/'));

  it('should display welcome message', () => {
    getTitle().contains('Plataforma | Vendors');
  });
});
