export const selectors = {
  login: {
    userInput: 'form input[name="user"]',
    passwordInput: 'form input[name="password"]',
    submitButton: 'form button[type="submit"]',
  },
  search: {
    policyholderSearchText: '[data-testid="policyholder-input-search"]',
    policyholderSearchInput:
      'button[class*="SearchInput_j-search-input__list__item"]',
    modalitiesSelectInput: '[data-testid="policyholder-modality"]',
  },
  coverageData: {
    durationInDaysInput: 'input[placeholder="Total de dias"]',
    securedAmount: '[data-testid="secured-amount"]',
  },
  rateCalculation: {
    feeInput: '[data-cy=fee-input]',
    totalPrizeLabel:
      '[data-testid="rate-calculation-final-values"] > article:first > p',
    finalComissionLabel:
      '[data-testid="rate-calculation-final-values"] > article:last > span > p',
    openFlexOptionsButton: '[data-testid="button-rate-flex-visible"]',
    comissionFlexInput: '[data-testid="input-comission-flex"]',
    feeFlexInput: '[data-testid="input-rate-flex"]',
  },
};
