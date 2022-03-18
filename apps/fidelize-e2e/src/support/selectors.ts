export const selectors = {
  login: {
    userInput: 'form input[name="user"]',
    passwordInput: 'form input[name="password"]',
    submitButton: 'form button[type="submit"]'
  },
  userMenu: {
    userMenuButton: '[data-testid="user-menu-trigger"]',
    logoutButton: '[data-testid="user-menu-logout-button"]'
  },
  dashboardSummary: {
    totalCard: 'div[class^="DashboardTotalCard"]'
  },
  opportunityDetailsList: {
    laborTab: '[data-testid="tab-labor"]',
    fiscalTab: '[data-testid="tab-fiscal"]',
    civilTab: '[data-testid="tab-civil"]',
    listBox: '[class^="OpportunityDetailsList"][class*="box"]',
    listItemWrapper: '[class*="listitem__wrapper"]'
  }
}