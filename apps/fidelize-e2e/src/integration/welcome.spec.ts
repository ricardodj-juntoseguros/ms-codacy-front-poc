import { loadData } from '../utils/loadData';

const data = loadData();

describe('Fidelize', () => {
  it('Should find the welcome message', () => {
    cy.visit('/');

    cy.get('h1').contains(data.welcomeText);
  });
});
