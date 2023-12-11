import '@testing-library/jest-dom';
import { proposalActions } from 'modules/broker-issuance/src/application/features/proposal/ProposalSlice';
import { insuredMock } from 'modules/broker-issuance/src/__mocks__';
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
