import '@testing-library/jest-dom';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import { store } from '../../../config/store';
import { fireEvent, render } from '../../../config/testUtils';
import { createQuoteMock, quoteResulMock } from '../../../__mocks__';
import { QuoteResultDTO } from '../../../application/types/dto';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import FlexRateToggle from './FlexRateToggle';

describe('FlexRateToggle', () => {
  beforeEach(() => {
    store.dispatch(quoteSliceActions.resetQuote());
  });

  it('Should disable the toggle if both current quote pricing flags are set to false', async () => {
    const modifiedResultMock = {
      ...quoteResulMock,
      pricing: {
        ...quoteResulMock.pricing,
        commissionFlexEnabled: false,
        commissionFlexMaxValue: null,
        feeFlexEnabled: false,
        feeFlexMaxValue: null,
      },
    } as QuoteResultDTO;
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => modifiedResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByTestId, getByText } = render(<FlexRateToggle />);
    const toggle = getByTestId('flexRateToggle-toggle-input');
    const button = getByTestId('flexRateToggle-tooltip-button');
    expect(toggle).toBeDisabled();
    fireEvent.mouseEnter(button);
    expect(
      getByText(
        'A taxa flex está desabilitada para esse tomador, mas você pode prosseguir normalmente com sua proposta. Em caso de dúvidas, entre em contato via chat.',
      ),
    ).toBeInTheDocument();
  });

  it('Should disable the toggle if current quote proposalFee is different from input ProposalFee', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResulMock);
    await store.dispatch(postQuotation(createQuoteMock));
    store.dispatch(quoteSliceActions.setProposalFee(1.5));
    const { getByTestId, getByText } = render(<FlexRateToggle />);
    const toggle = getByTestId('flexRateToggle-toggle-input');
    const button = getByTestId('flexRateToggle-tooltip-button');
    expect(toggle).toBeDisabled();
    fireEvent.mouseEnter(button);
    expect(
      getByText(
        'A taxa flex está desabilitada pois você deve recalcular sua cotação após a alteração da taxa padrão. Clique em "Calcular" para habilitar novamente.',
      ),
    ).toBeInTheDocument();
  });

  it('Should change store value on toggle check', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResulMock);
    await store.dispatch(postQuotation(createQuoteMock));
    const { getByTestId } = render(<FlexRateToggle />);
    const toggle = getByTestId('flexRateToggle-toggle-input');
    expect(toggle).toBeEnabled();
    fireEvent.click(toggle);
    expect(store.getState().quote.toggleRateFlex).toBe(true);
  });
});
