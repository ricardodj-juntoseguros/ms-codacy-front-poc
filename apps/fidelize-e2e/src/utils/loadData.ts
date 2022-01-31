import * as data from '../data/data.json';

export const loadData = () => {
  switch(Cypress.env('target')) {
    case 'dev':
    case 'qas':
      return data;
    default:
      return data;
  }
}