import '@testing-library/jest-dom';
import { fireEvent, render } from '../../../config/testUtils';
import {
  createQuoteMock,
  modalityBidderMock,
  policyholderMock,
  quoteResulMock,
} from '../../../__mocks__';
import { store } from '../../../config/store';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import QuotationPricingApi from '../../../application/features/quotationPricing/QuotationPricingApi';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import SecuredAmountAndPricing from './SecuredAmountAndPricing';

const mockHook = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useQuotation: () => mockHook,
  };
});
describe('SecuredAmountAndPricing', () => {
  beforeAll(() => {
    store.dispatch(quoteSliceActions.setPolicyholder(policyholderMock));
    store.dispatch(quoteSliceActions.setModality(modalityBidderMock));
  });

  afterAll(() => {
    store.dispatch(quoteSliceActions.resetQuote());
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch policyholder limit on modality on mount', async () => {
    const apiMock = jest
      .spyOn(QuotationPricingApi, 'getPolicyholderBalanceLimits')
      .mockImplementation(async () => ({
        availableLimit: 10000,
        availableFlexibilizationLimit: 15000,
        showFlexibilizationLimit: true,
      }));
    const { findByText } = render(<SecuredAmountAndPricing />);
    expect(
      await findByText('Limite disponível: R$ 15.000,00'),
    ).toBeInTheDocument();
    expect(apiMock).toHaveBeenCalled();
  });

  it('should dispatch filled secured amount value to store and call useQuotation hook on blur', async () => {
    jest
      .spyOn(QuotationPricingApi, 'getPolicyholderBalanceLimits')
      .mockImplementation(async () => ({
        availableLimit: 10000,
        availableFlexibilizationLimit: 15000,
        showFlexibilizationLimit: true,
      }));
    const { findByTestId } = render(<SecuredAmountAndPricing />);
    const input = await findByTestId(
      'securedAmountAndPricing-input-securedAmount',
    );
    fireEvent.change(input, {
      target: { value: '20000' },
    });
    fireEvent.blur(input);
    expect(store.getState().quote.securedAmount).toEqual(20000);
    expect(mockHook).toHaveBeenCalled();
  });

  it('Should display correct data when there is currentQuote on store', async () => {
    jest
      .spyOn(QuotationPricingApi, 'getPolicyholderBalanceLimits')
      .mockImplementation(async () => ({
        availableLimit: 10000,
        availableFlexibilizationLimit: 15000,
        showFlexibilizationLimit: true,
      }));
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResulMock);
    await store.dispatch(postQuotation(createQuoteMock));
    const { findByTestId, findByText } = render(<SecuredAmountAndPricing />);
    expect(await findByText('R$ 190,00')).toBeInTheDocument();
    expect(await findByText('R$ 38,00')).toBeInTheDocument();
    expect(await findByText('20%')).toBeInTheDocument();
    expect(await findByText('0,26%')).toBeInTheDocument();
    expect(
      await findByTestId('securedAmountAndPricing-input-proposalFee'),
    ).toHaveValue('0,26%');
  });

  it('Should dispatch proposalFee to store on fill', async () => {
    jest
      .spyOn(QuotationPricingApi, 'getPolicyholderBalanceLimits')
      .mockImplementation(async () => ({
        availableLimit: 10000,
        availableFlexibilizationLimit: 15000,
        showFlexibilizationLimit: true,
      }));
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResulMock);
    await store.dispatch(postQuotation(createQuoteMock));
    const { findByTestId } = render(<SecuredAmountAndPricing />);
    const input = await findByTestId(
      'securedAmountAndPricing-input-proposalFee',
    );
    fireEvent.change(input, { target: { value: '1,50' } });
    expect(store.getState().quote.proposalFee).toEqual(1.5);
  });

  it('Should call useQuotation hook on calculate button click', async () => {
    jest
      .spyOn(QuotationPricingApi, 'getPolicyholderBalanceLimits')
      .mockImplementation(async () => ({
        availableLimit: 10000,
        availableFlexibilizationLimit: 15000,
        showFlexibilizationLimit: true,
      }));
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResulMock);
    await store.dispatch(postQuotation(createQuoteMock));
    const { findByTestId } = render(<SecuredAmountAndPricing />);
    const input = await findByTestId(
      'securedAmountAndPricing-input-proposalFee',
    );
    fireEvent.change(input, { target: { value: '1,50' } });
    const button = await findByTestId(
      'securedAmountAndPricing-button-calculate',
    );
    fireEvent.click(button);
    expect(mockHook).toHaveBeenCalled();
  });
});
