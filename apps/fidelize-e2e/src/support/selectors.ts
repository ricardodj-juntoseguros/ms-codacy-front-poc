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
    listItemWrapper: '[class*="listitem__wrapper"]',
    moreDetailsButton: '[class*="listitem__wrapper"] button'
  },
  modal: {
    wrapper: 'div[class*="modal__wrapper"]',
    title: 'h1[class*="modal__title"]',
    primaryButton: 'button[class*="primary"]',
    icon: 'div[class*="modal__icon"]'
  }
}