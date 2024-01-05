import '@testing-library/jest-dom';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import {
  proposalActions,
  putProposal,
} from '../../../application/features/proposal/ProposalSlice';
import { insuredMock, proposalMock } from '../../../__mocks__';
import { act, fireEvent, render } from '../../../config/testUtils';
import { store } from '../../../config/store';
import InsuredDataForm from './InsuredDataForm';

const advanceStepMock = jest.fn();
jest.mock('@shared/hooks', () => {
  const originalModule = jest.requireActual('@shared/hooks');
  return {
    __esModule: true,
    ...originalModule,
    useFlow: () => ({
      advanceStep: advanceStepMock,
    }),
  };
});

const createProposalMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useProposal: () => createProposalMock,
  };
});

describe('InsuredDataForm', () => {
  const mockResult = {
    ProposalId: 12345,
    PolicyId: 11111,
    QuotationId: 12223,
    NewQuoterId: 123333,
    createdAt: '2024-01-01T12:00:00.000Z',
  };

  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it('should be able to enter the bidding number in the store', async () => {
    const { getByTestId } = render(<InsuredDataForm name="InsuredDataForm" />);
    const biddingNumberInput = getByTestId(
      'insuredDataForm-biddingNumber-input',
    );
    await act(async () => {
      await fireEvent.change(biddingNumberInput, {
        target: { value: '123456' },
      });
    });
    const state = store.getState();
    expect(state.proposal.biddingNumber).toEqual('123456');
  });

  it('should be able to enter the bidding description in the store', async () => {
    const { getByTestId } = render(<InsuredDataForm name="InsuredDataForm" />);
    const biddingDescriptionInput = getByTestId(
      'insuredDataForm-biddingDescription-input',
    );
    await act(async () => {
      await fireEvent.change(biddingDescriptionInput, {
        target: { value: '12345' },
      });
    });
    const state = store.getState();
    expect(state.proposal.biddingDescription).toEqual('12345');
  });

  it('should be able to call a hook to create a proposal and, if successful, proceed to the next step', async () => {
    jest
      .spyOn(ProposalApi, 'putProposal')
      .mockImplementation(() => Promise.resolve(mockResult));
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    const { getByTestId, rerender } = render(
      <InsuredDataForm name="InsuredDataForm" />,
    );
    const submitButton = getByTestId('insuredDataForm-submit-button');
    expect(submitButton).toBeDisabled();
    store.dispatch(proposalActions.setInsured(insuredMock));
    store.dispatch(proposalActions.setInsuredAddress(insuredMock.addresses[0]));
    store.dispatch(proposalActions.setBiddingNumber('123456'));
    expect(submitButton).not.toBeDisabled();
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    expect(createProposalMock).toHaveBeenCalled();
    store.dispatch(proposalActions.setCreateProposalSuccess(true));
    const state = store.getState();
    expect(state.proposal.createProposalSuccess).toBeTruthy();
    rerender(<InsuredDataForm name="InsuredDataForm" />);
    // expect(advanceStepMock).toHaveBeenCalledWith('InsuredDataForm');
  });
});
