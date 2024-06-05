import '@testing-library/jest-dom';
import { render } from '../../../config/testUtils';
import { createQuoteMock, quoteResultMock } from '../../../__mocks__';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import { store } from '../../../config/store';
import Pricing from './Pricing';

describe('Pricing', () => {
  it('should be able to render the pricing component', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByText } = render(<Pricing />);
    expect(getByText('R$ 190,00')).toBeInTheDocument();
    expect(getByText('R$ 38,00')).toBeInTheDocument();
    expect(getByText('20%')).toBeInTheDocument();
    expect(getByText('0,26%')).toBeInTheDocument();
  });

  it('should be able to render the fee flex', async () => {
    jest.spyOn(QuoteApi, 'postQuotation').mockImplementation(async () => ({
      ...quoteResultMock,
      pricing: {
        ...quoteResultMock.pricing,
        feeFlex: 0.5,
        feeFlexEnabled: true,
      },
    }));
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByText } = render(<Pricing />);
    expect(getByText('0,50%')).toBeInTheDocument();
  });

  it('should be able to render the commission flex', async () => {
    jest.spyOn(QuoteApi, 'postQuotation').mockImplementation(async () => ({
      ...quoteResultMock,
      pricing: {
        ...quoteResultMock.pricing,
        commissionFlex: 50,
        commissionFlexEnable: true,
      },
    }));
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByText } = render(<Pricing />);
    expect(getByText('R$ 50,00')).toBeInTheDocument();
  });

  it('should be able to render the commission flex', async () => {
    jest.spyOn(QuoteApi, 'postQuotation').mockImplementation(async () => ({
      ...quoteResultMock,
      pricing: {
        ...quoteResultMock.pricing,
        commissionFlex: 50,
        commissionFlexEnable: true,
      },
    }));
    await store.dispatch(postQuotation(createQuoteMock));
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByText } = render(<Pricing />);
    expect(getByText('R$ 50,00')).toBeInTheDocument();
  });

  it('should be able to not render the pricing component', async () => {
    store.dispatch(quoteSliceActions.resetQuote());
    const { queryByText } = render(<Pricing />);
    expect(await queryByText('R$ 190,00')).not.toBeInTheDocument();
    expect(await queryByText('R$ 38,00')).not.toBeInTheDocument();
    expect(await queryByText('20%')).not.toBeInTheDocument();
    expect(await queryByText('0,26%')).not.toBeInTheDocument();
  });
});
