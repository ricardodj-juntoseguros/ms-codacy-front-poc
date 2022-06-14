import './cypressEvents';
import './authentication';

// Type definitions

declare global {
  namespace Cypress {
    interface Chainable {
      // Authentication

      login(user: string, password: string): Chainable<Element>;
    }
  }
}
