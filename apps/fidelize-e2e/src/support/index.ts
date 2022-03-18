import './cypressEvents';
import './authentication';
import './dashboard';

// Type definitions

declare global {
  namespace Cypress {
    interface Chainable {
      
      // Authentication
      
      login(user: string, password: string): Chainable<Element>;
      loginRequest(user: string, password: string): Chainable<Element>;
      logout(): Chainable<Element>;

      // Dashboard

      goToOpportunityDetailsListTab(tab: 'labor' | 'fiscal' | 'civil'): Chainable<Element>;
    }
  }
}