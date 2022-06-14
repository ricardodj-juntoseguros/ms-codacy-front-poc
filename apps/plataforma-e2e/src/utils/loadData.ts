import * as data from '../data/data.json';

export const loadData = () => {
  switch (Cypress.env('target')) {
    case 'dev':
    case 'quality':
    case 'staging':
      return data;
    default:
      return data;
  }
};
