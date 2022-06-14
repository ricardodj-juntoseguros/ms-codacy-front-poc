import { loadData, currencyFormatter } from '../../utils';
import { selectors } from '../../support/selectors';
import { HOSTS } from '../../../../../e2e/quality.json';

const { user } = loadData();

beforeEach(() => {
  cy.visit(HOSTS.PLATAFORMA);
  cy.login(user.username, user.password);
  cy.get(selectors.login.submitButton)
    .should('be.visible')
    .click({ force: true });
});

describe('Plataforma - corretor-emissão - Quote Common', () => {
  it('should go to the quote flow', () => {
    cy.get(selectors.search.policyholderSearchText).should('be.visible');
  });

  it('should perform the quote flow correctly', () => {
    cy.get(selectors.search.policyholderSearchText).type('squad');

    cy.get(selectors.search.policyholderSearchInput)
      .should('be.visible')
      .should(
        'have.text',
        'TOMADOR TESTE – SQUAD DESACOPLAMENTO - 91833813000118',
      )
      .click({ force: true });

    cy.intercept(
      `/squad1/ms-plataforma-bff/api_policyholder/policyholders/180988/modalities-to-policyholder`,
    ).as('getPolicyholderModalities');
    cy.wait('@getPolicyholderModalities', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get(selectors.search.modalitiesSelectInput)
      .should('be.visible')
      .click({ force: true })
      .type('{downArrow}')
      .type('{enter}');

    cy.get(selectors.coverageData.durationInDaysInput)
      .should('be.visible')
      .clear()
      .type('365');
    cy.get(selectors.coverageData.securedAmount)
      .should('be.visible')
      .clear()
      .type('10000', { delay: 200 })
      .blur();

    cy.intercept(
      `/squad1/ms-plataforma-bff/ms-middleware-proposal/api/quotation`,
    ).as('generateQuote');

    cy.wait('@generateQuote', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get('@generateQuote').should(({ response }: any) => {
      cy.get(selectors.rateCalculation.feeInput)
        .should('be.visible')
        .should('have.value', `${response.body.pricing.fee} %`);

      cy.get(selectors.rateCalculation.totalPrizeLabel).should($element => {
        expect($element).to.contain(
          currencyFormatter(response.body.quote.totalPrize),
        );
      });

      cy.get(selectors.rateCalculation.finalComissionLabel).should($element => {
        expect($element).to.contain(
          currencyFormatter(response.body.pricing.comissionValue),
        );
      });
    });
  });

  it('should perform the quote flow correctly and update fee', () => {
    cy.get(selectors.search.policyholderSearchText).type('squad');

    cy.get(selectors.search.policyholderSearchInput)
      .should('be.visible')
      .should(
        'have.text',
        'TOMADOR TESTE – SQUAD DESACOPLAMENTO - 91833813000118',
      )
      .click({ force: true });

    cy.intercept(
      `/squad1/ms-plataforma-bff/api_policyholder/policyholders/180988/modalities-to-policyholder`,
    ).as('getPolicyholderModalities');
    cy.wait('@getPolicyholderModalities', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get(selectors.search.modalitiesSelectInput)
      .should('be.visible')
      .click({ force: true })
      .type('{downArrow}')
      .type('{enter}');

    cy.get(selectors.coverageData.durationInDaysInput)
      .should('be.visible')
      .clear()
      .type('365');
    cy.get(selectors.coverageData.securedAmount)
      .should('be.visible')
      .clear()
      .type('10000', { delay: 200 })
      .blur();

    cy.intercept(
      `/squad1/ms-plataforma-bff/ms-middleware-proposal/api/quotation`,
    ).as('generateQuote');

    cy.wait('@generateQuote', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get(selectors.rateCalculation.feeInput)
      .should('be.visible')
      .clear()
      .type('2.2', { delay: 200 })
      .blur();

    cy.wait('@generateQuote', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get('@generateQuote').should(({ response }: any) => {
      cy.get(selectors.rateCalculation.feeInput)
        .should('be.visible')
        .should('have.value', '2.2 %');

      cy.get(`${selectors.rateCalculation.totalPrizeLabel}`).should(
        $element => {
          expect($element).to.contain(
            currencyFormatter(response.body.quote.totalPrize),
          );
        },
      );

      cy.get(`${selectors.rateCalculation.finalComissionLabel}`).should(
        $element => {
          expect($element).to.contain(
            currencyFormatter(response.body.pricing.comissionValue),
          );
        },
      );
    });
  });

  it('should perform the quote flow correctly and update comission flex', () => {
    cy.get(selectors.search.policyholderSearchText).type('squad');

    cy.get(selectors.search.policyholderSearchInput)
      .should('be.visible')
      .should(
        'have.text',
        'TOMADOR TESTE – SQUAD DESACOPLAMENTO - 91833813000118',
      )
      .click({ force: true });

    cy.intercept(
      `/squad1/ms-plataforma-bff/api_policyholder/policyholders/180988/modalities-to-policyholder`,
    ).as('getPolicyholderModalities');
    cy.wait('@getPolicyholderModalities', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get(selectors.search.modalitiesSelectInput)
      .should('be.visible')
      .click({ force: true })
      .type('{downArrow}')
      .type('{enter}');

    cy.get(selectors.coverageData.durationInDaysInput)
      .should('be.visible')
      .clear()
      .type('365');
    cy.get(selectors.coverageData.securedAmount)
      .should('be.visible')
      .clear()
      .type('50000', { delay: 200 })
      .blur();

    cy.intercept(
      `/squad1/ms-plataforma-bff/ms-middleware-proposal/api/quotation`,
    ).as('generateQuote');

    cy.wait('@generateQuote', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get(selectors.rateCalculation.openFlexOptionsButton)
      .should('be.visible')
      .click({ force: true });

    cy.get(selectors.rateCalculation.comissionFlexInput)
      .should('be.visible')
      .clear()
      .type('400', { delay: 200 })
      .blur();

    cy.wait('@generateQuote', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get('@generateQuote').should(({ response }: any) => {
      cy.get(selectors.rateCalculation.comissionFlexInput)
        .should('be.visible')
        .should('have.value', 'R$ 400,00');

      cy.get(`${selectors.rateCalculation.totalPrizeLabel}`).should(
        $element => {
          expect($element).to.contain(
            currencyFormatter(response.body.quote.totalPrize),
          );
        },
      );

      cy.get(`${selectors.rateCalculation.finalComissionLabel}`).should(
        $element => {
          expect($element).to.contain(
            currencyFormatter(response.body.pricing.comissionValue),
          );
        },
      );
    });
  });

  it('should perform the quote flow correctly and update fee flex', () => {
    cy.get(selectors.search.policyholderSearchText).type('squad');

    cy.get(selectors.search.policyholderSearchInput)
      .should('be.visible')
      .should(
        'have.text',
        'TOMADOR TESTE – SQUAD DESACOPLAMENTO - 91833813000118',
      )
      .click({ force: true });

    cy.intercept(
      `/squad1/ms-plataforma-bff/api_policyholder/policyholders/180988/modalities-to-policyholder`,
    ).as('getPolicyholderModalities');
    cy.wait('@getPolicyholderModalities', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get(selectors.search.modalitiesSelectInput)
      .should('be.visible')
      .click({ force: true })
      .type('{downArrow}')
      .type('{enter}');

    cy.get(selectors.coverageData.durationInDaysInput)
      .should('be.visible')
      .clear()
      .type('365');

    cy.get(selectors.coverageData.securedAmount)
      .should('be.visible')
      .clear()
      .type('100000', { delay: 200 })
      .blur();

    cy.intercept(
      `/squad1/ms-plataforma-bff/ms-middleware-proposal/api/quotation`,
    ).as('generateQuote');

    cy.wait('@generateQuote', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get(selectors.rateCalculation.openFlexOptionsButton)
      .should('be.visible')
      .click({ force: true });

    cy.get(selectors.rateCalculation.feeFlexInput)
      .should('be.visible')
      .clear()
      .type('3.2', { delay: 200 })
      .blur();

    cy.wait('@generateQuote', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get('@generateQuote').should(({ response }: any) => {
      cy.get(`${selectors.rateCalculation.feeInput}`)
        .should('be.visible')
        .should('have.value', `${response.body.pricing.feeStandard} %`);

      cy.get(selectors.rateCalculation.feeFlexInput)
        .should('be.visible')
        .should('have.value', '3.2 %');

      cy.get(`${selectors.rateCalculation.totalPrizeLabel}`).should(
        $element => {
          expect($element).to.contain(
            currencyFormatter(response.body.quote.totalPrize),
          );
        },
      );

      cy.get(`${selectors.rateCalculation.finalComissionLabel}`).should(
        $element => {
          expect($element).to.contain(
            currencyFormatter(response.body.pricing.comissionValue),
          );
        },
      );
    });
  });

  it('should show error when entering a flex commission amount above the allowed', () => {
    cy.get(selectors.search.policyholderSearchText).type('squad');

    cy.get(selectors.search.policyholderSearchInput)
      .should('be.visible')
      .should(
        'have.text',
        'TOMADOR TESTE – SQUAD DESACOPLAMENTO - 91833813000118',
      )
      .click({ force: true });

    cy.intercept(
      `/squad1/ms-plataforma-bff/api_policyholder/policyholders/180988/modalities-to-policyholder`,
    ).as('getPolicyholderModalities');
    cy.wait('@getPolicyholderModalities', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get(selectors.search.modalitiesSelectInput)
      .should('be.visible')
      .click({ force: true })
      .type('{downArrow}')
      .type('{enter}');

    cy.get(selectors.coverageData.durationInDaysInput)
      .should('be.visible')
      .clear()
      .type('365');
    cy.get(selectors.coverageData.securedAmount)
      .should('be.visible')
      .clear()
      .type('50000', { delay: 200 })
      .blur();

    cy.intercept(
      `/squad1/ms-plataforma-bff/ms-middleware-proposal/api/quotation`,
    ).as('generateQuote');

    cy.wait('@generateQuote', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get(selectors.rateCalculation.openFlexOptionsButton)
      .should('be.visible')
      .click({ force: true });

    cy.get(selectors.rateCalculation.comissionFlexInput)
      .should('be.visible')
      .clear()
      .type('650', { delay: 200 })
      .blur();

    cy.wait('@generateQuote', {
      requestTimeout: 120000,
      responseTimeout: 120000,
    });

    cy.get('@generateQuote').should(({ response }: any) => {
      expect(response.body[0].code).equal('UNDEFINED_0');
    });
  });
});
