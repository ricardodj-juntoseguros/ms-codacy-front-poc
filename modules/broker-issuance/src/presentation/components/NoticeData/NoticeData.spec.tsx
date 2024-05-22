import '@testing-library/jest-dom';
import { fireEvent, render } from '../../../config/testUtils';
import { store } from '../../../config/store';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { modalityServiceProfiderPerformerMock } from '../../../__mocks__';
import NoticeData from './NoticeData';

const updateProposalMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useProposal: () => updateProposalMock,
  };
});

describe('NoticeData', () => {
  it('should be able to fill in the bidding number and when leaving the field the hook must be called', async () => {
    await store.dispatch(
      quoteSliceActions.setModality(modalityServiceProfiderPerformerMock),
    );
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <NoticeData />,
    );
    const input = getByTestId('noticeData-biddingNumber-input');
    fireEvent.change(input, {
      target: { value: '123456' },
    });
    fireEvent.blur(input);
    const state = store.getState();
    expect(getByText('Número do edital ou contrato')).toBeInTheDocument();
    expect(
      getByPlaceholderText(
        'Ex. nº 000/0000, oriundo da Concorrência nº 00/0000, firmado em 00/00/0000',
      ),
    ).toBeInTheDocument();
    expect(state.proposal.biddingNumber).toBe('123456');
    expect(state.validation.errors.biddingNumber).toBeUndefined();
    expect(updateProposalMock).toHaveBeenCalled();
  });

  it('should be able to render a child component', async () => {
    await store.dispatch(
      quoteSliceActions.setModality(modalityServiceProfiderPerformerMock),
    );
    const { getByText } = render(
      <NoticeData>
        <h1>test children</h1>
      </NoticeData>,
    );
    expect(getByText('test children')).toBeInTheDocument();
  });
});
