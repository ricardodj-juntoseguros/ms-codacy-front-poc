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
    totalCard: 'div[class^="DashboardTotalCard"]',
    searchText: '.InputBase_j-input__field__hIwAu',
    searchInput: 'button[class*="SearchInput_j-search-input__list__item"]',
    searchSelect: '.Tag_j-tag__wrapper__2h1qe',
    searchButton: '[data-testid="btn-apply-filter"]'
  },
  opportunityDetailsList: {
    laborTab: '[data-testid="tab-labor"]',
    fiscalTab: '[data-testid="tab-fiscal"]',
    civilTab: '[data-testid="tab-civil"]',
    listBox: '[class^="OpportunityDetailsList"][class*="box"]',
    listItemWrapper: '[class*="listitem__wrapper"]',
    moreDetailsButton: '[data-testid="modal-trigger"]',
    email: '[data-testid="mail-input-more-details"]',
    sendButton: '[data-testid="submit-more-details-email"]'
  },
  modal: {
    wrapper: 'div[class*="modal__wrapper"]',
    title: 'h1[class*="modal__title"]',
    primaryButton: '[data-testid=submit-more-details]',
    disclaimer: 'div[class^="OpportunityDetailsModal_opportunity"][class*="details-modal__disclaimer"]'
  }
}
