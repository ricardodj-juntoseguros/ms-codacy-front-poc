import '@testing-library/jest-dom';
import { fireEvent, render } from '../../../config/testUtils';
import { store } from '../../../config/store';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import { createQuoteMock, quoteResultMock } from '../../../__mocks__';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import { QuoteResultDTO } from '../../../application/types/dto';
import FeeCalculation from './FeeCalculation';

describe('FeeCalculation', () => {
  beforeEach(() => {
    store.dispatch(quoteSliceActions.resetQuote());
  });

  it('Should dispatch proposalFee to store on fill', async () => {
    const { findByTestId } = render(
      <FeeCalculation onCalculateCallback={jest.fn()} />,
    );
    const input = await findByTestId('feeCalculation-input-proposalFee');
    fireEvent.change(input, { target: { value: '1,50' } });
    expect(store.getState().quote.proposalFee).toEqual(1.5);
  });

  it('Should call onCalculateCallback prop on calculate button click', async () => {
    const mockFn = jest.fn();
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    const { findByTestId } = render(
      <FeeCalculation onCalculateCallback={mockFn} />,
    );
    const input = await findByTestId('feeCalculation-input-proposalFee');
    fireEvent.change(input, { target: { value: '1,50' } });
    const button = await findByTestId('feeCalculation-button-calculate');
    fireEvent.click(button);
    expect(mockFn).toHaveBeenCalled();
  });

  it('Should display commission flex input correctly and dispatch value to store on fill', async () => {
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    store.dispatch(quoteSliceActions.setToggleRateFlex());
    const { findByTestId, getByText } = render(
      <FeeCalculation onCalculateCallback={jest.fn()} />,
    );
    const input = await findByTestId('feeCalculation-input-commissionFlex');
    fireEvent.change(input, { target: { value: 'R$ 75,00' } });
    expect(store.getState().quote.commissionFlex).toEqual(75);
    expect(
      getByText('Você pode ter uma comissão de até R$ 100,00.'),
    ).toBeInTheDocument();
  });

  it('Should display fee flex input correctly and dispatch value to store on fill', async () => {
    const modifiedResultMock = {
      ...quoteResultMock,
      pricing: {
        ...quoteResultMock.pricing,
        commissionFlexEnabled: false,
        commissionFlexMaxValue: null,
        feeFlexEnabled: true,
        feeFlexMaxValue: 50,
      },
    } as QuoteResultDTO;
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => modifiedResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    store.dispatch(quoteSliceActions.setToggleRateFlex());
    const { findByTestId } = render(
      <FeeCalculation onCalculateCallback={jest.fn()} />,
    );
    const input = await findByTestId('feeCalculation-input-feeFlex');
    fireEvent.change(input, { target: { value: '30,00' } });
    expect(store.getState().quote.feeFlex).toEqual(30);
  });
});
