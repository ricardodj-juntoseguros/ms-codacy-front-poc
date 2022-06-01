import * as reactRedux from 'react-redux';
import { fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { quoteSliceActions } from 'modules/corretor-emissao/src/application/features/quote/QuoteSlice';
import { storeMock } from '../../../__mocks__';
import { render } from '../../../config/testUtils';
import { RateCalculation } from './RateCalculation';
import * as store from '../../../config/store';
import RateFlexApi from '../../../application/features/rateFlex/RateFlexApi';

const mockGenerateQuote = jest.fn(() => ({ quoteGeneratedSuccessfully: true }));
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');

  return {
    ...rest,
    useGenerateQuote: () => ({ fechGenerateQuote: mockGenerateQuote }),
  };
});

describe('RateCalculation component', () => {
  const mockDispatch = jest.fn();
  let useDispatchMock: jest.SpyInstance;
  let useAppDispatchMock: jest.SpyInstance;

  beforeEach(() => {
    useDispatchMock = jest.spyOn(reactRedux, 'useSelector');
    useAppDispatchMock = jest.spyOn(store, 'useAppDispatch');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render successfully', () => {
    const { baseElement } = render(<RateCalculation />);

    expect(baseElement).toBeTruthy();
  });

  it('should be able to show the flex rate if the policyholder has access', async () => {
    const policyHolderId = 180988;
    const modalityId = 48;

    useDispatchMock.mockImplementation(select => select({ ...storeMock }));
    useAppDispatchMock.mockImplementation(() => mockDispatch);

    const rateFlexMockApi = jest
      .spyOn(RateFlexApi, 'getRateFlexEnabled')
      .mockImplementation(() =>
        Promise.resolve({ flexTax: true, message: '' }),
      );

    const { getByTestId } = render(<RateCalculation />);
    await rateFlexMockApi;

    const buttonRateFlexVisible = getByTestId('button-rate-flex-visible');

    expect(rateFlexMockApi).toHaveBeenCalledWith(policyHolderId, modalityId);
    expect(buttonRateFlexVisible).toBeTruthy();
  });

  it('should be able to not show the flex rate if the policyholder not has access', async () => {
    const policyHolderId = 180988;
    const modalityId = 48;

    useDispatchMock.mockImplementation(select => select({ ...storeMock }));
    useAppDispatchMock.mockImplementation(() => mockDispatch);

    const rateFlexMockApi = jest
      .spyOn(RateFlexApi, 'getRateFlexEnabled')
      .mockImplementation(() =>
        Promise.resolve({ flexTax: false, message: '' }),
      );

    const { queryByTestId } = render(<RateCalculation />);

    expect(rateFlexMockApi).toHaveBeenCalledWith(policyHolderId, modalityId);
    await waitFor(async () => {
      expect(queryByTestId('button-rate-flex-visible')).toBeFalsy();
    });
  });

  it('should be able to not show the flex rate if the policyholder not has access', async () => {
    useDispatchMock.mockImplementation(select => select({ ...storeMock }));
    useAppDispatchMock.mockImplementation(() => mockDispatch);

    jest
      .spyOn(RateFlexApi, 'getRateFlexEnabled')
      .mockImplementation(() =>
        Promise.resolve({ flexTax: true, message: '' }),
      );

    const { getByTestId, getByPlaceholderText } = render(<RateCalculation />);

    const buttonRateFlexVisible = getByTestId('button-rate-flex-visible');
    fireEvent.click(buttonRateFlexVisible);

    const proposalFeeInput = getByPlaceholderText('Taxa Padrão');
    const comissionFlexInput = getByTestId('input-comission-flex');
    const rateFlexInput = getByTestId('input-rate-flex');

    await act(async () => {
      fireEvent.change(proposalFeeInput, { target: { value: 1.87 } });
    });
    await act(async () => {
      fireEvent.change(rateFlexInput, { target: { value: 2.2 } });
    });
    await act(async () => {
      fireEvent.change(comissionFlexInput, { target: { value: 100 } });
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      quoteSliceActions.setProposalFee(1.87),
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      quoteSliceActions.setFeeFlex(2.2),
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      quoteSliceActions.setCommissionFlex(100),
    );
  });

  it('should be able to call generateQuote', async () => {
    useDispatchMock.mockImplementation(select => select({ ...storeMock }));
    useAppDispatchMock.mockImplementation(() => mockDispatch);

    jest
      .spyOn(RateFlexApi, 'getRateFlexEnabled')
      .mockImplementation(() =>
        Promise.resolve({ flexTax: true, message: '' }),
      );

    const { getByPlaceholderText } = render(<RateCalculation />);

    const proposalFeeInput = getByPlaceholderText('Taxa Padrão');

    await act(async () => {
      fireEvent.focus(proposalFeeInput);
      fireEvent.change(proposalFeeInput, { target: { value: 2.2 } });
      fireEvent.blur(proposalFeeInput);
    });

    expect(mockGenerateQuote).toHaveBeenCalled();
  });
});
