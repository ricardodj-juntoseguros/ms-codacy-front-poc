import './cypressEvents';
import './getLinkFirstAccess';

// Type definitions

declare global {
  namespace Cypress {
    interface Chainable {
      getLink(): Chainable<Element>;
    }
  }
}
