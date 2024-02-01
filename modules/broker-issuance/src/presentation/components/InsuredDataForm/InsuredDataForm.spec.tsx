import '@testing-library/jest-dom';
import { quoteSliceActions } from '../../../application/features/quote/QuoteSlice';
import { contractualConditionActions } from '../../../application/features/contractualCondition/ContractualConditionSlice';
import ContractualConditionApi from '../../../application/features/contractualCondition/ContractualConditionApi';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import {
  proposalActions,
  putProposal,
} from '../../../application/features/proposal/ProposalSlice';
import CanAuthorizeApi from '../../../application/features/canAuthorize/CanAuthorizeApi';
import {
  customClauseMock,
  insuredMock,
  objectPreviewResultMock,
  policyholderDetailsMock,
  proposalMock,
} from '../../../__mocks__';
import { act, fireEvent, render, waitFor } from '../../../config/testUtils';
import { store } from '../../../config/store';
import InsuredDataForm from './InsuredDataForm';
import ObjectPreviewApi from '../../../application/features/objectPreview/ObjectPreviewApi';

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
  const contractualConditionApiMock = jest
    .spyOn(ContractualConditionApi, 'getCustomClause')
    .mockImplementation(() => Promise.resolve([]));
  jest
    .spyOn(ContractualConditionApi, 'getCustomClause')
    .mockImplementation(() => Promise.resolve(customClauseMock));

  beforeEach(() => {
    store.dispatch(contractualConditionActions.clearContractualConditions());
  });

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
      await fireEvent.blur(biddingNumberInput);
    });
    const state = store.getState();
    expect(state.proposal.biddingNumber).toEqual('123456');
    expect(createProposalMock).toHaveBeenCalled();
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
      await fireEvent.blur(biddingDescriptionInput);
    });
    const state = store.getState();
    expect(state.proposal.biddingDescription).toEqual('12345');
    expect(createProposalMock).toHaveBeenCalled();
  });

  it('should be able to call a hook to create a proposal', async () => {
    jest
      .spyOn(ProposalApi, 'putProposal')
      .mockImplementation(() => Promise.resolve(mockResult));
    jest.spyOn(CanAuthorizeApi, 'getCanAuthorize').mockImplementation(() =>
      Promise.resolve({
        isAutomaticPolicy: true,
        issueMessage: '',
        hasOnlyFinancialPending: true,
      }),
    );
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    const { getByTestId } = render(<InsuredDataForm name="InsuredDataForm" />);
    const submitButton = getByTestId('insuredDataForm-submit-button');
    await waitFor(async () => {
      await expect(contractualConditionApiMock).toHaveBeenCalled();
    });
    expect(submitButton).toBeDisabled();
    store.dispatch(proposalActions.setInsured(insuredMock));
    store.dispatch(proposalActions.setInsuredAddress(insuredMock.addresses[0]));
    store.dispatch(proposalActions.setBiddingNumber('123456'));
    expect(submitButton).not.toBeDisabled();
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    expect(createProposalMock).toHaveBeenCalled();
  });

  it('should be able to open object preview modal', async () => {
    jest
      .spyOn(ObjectPreviewApi, 'getObjectPreview')
      .mockImplementation(() => Promise.resolve(objectPreviewResultMock));
    jest
      .spyOn(ProposalApi, 'putProposal')
      .mockImplementation(() => Promise.resolve(mockResult));
    jest.spyOn(CanAuthorizeApi, 'getCanAuthorize').mockImplementation(() =>
      Promise.resolve({
        isAutomaticPolicy: true,
        issueMessage: '',
        hasOnlyFinancialPending: true,
      }),
    );
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    const { getByTestId } = render(<InsuredDataForm name="InsuredDataForm" />);
    const objectPreviewButton = getByTestId(
      'insuredDataForm-show-object-preview-button',
    );
    await waitFor(async () => {
      await expect(contractualConditionApiMock).toHaveBeenCalled();
    });
    store.dispatch(proposalActions.setInsured(insuredMock));
    store.dispatch(proposalActions.setInsuredAddress(insuredMock.addresses[0]));
    store.dispatch(proposalActions.setBiddingNumber('123456'));
    expect(objectPreviewButton).not.toBeDisabled();
    await act(async () => {
      await fireEvent.click(objectPreviewButton);
    });
    expect(getByTestId('modal-backdrop')).toBeInTheDocument();
  });

  it('should be able to display the insertion of contractual conditions', async () => {
    jest
      .spyOn(ProposalApi, 'putProposal')
      .mockImplementation(() => Promise.resolve(mockResult));
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    jest.spyOn(CanAuthorizeApi, 'getCanAuthorize').mockImplementation(() =>
      Promise.resolve({
        isAutomaticPolicy: true,
        issueMessage: '',
        hasOnlyFinancialPending: true,
      }),
    );
    await store.dispatch(
      quoteSliceActions.setPolicyholder(
        policyholderDetailsMock.registrationData,
      ),
    );
    const { getByTestId } = render(<InsuredDataForm name="InsuredDataForm" />);
    await waitFor(async () => {
      await expect(
        getByTestId('contractualConditions-toggle-show'),
      ).toBeInTheDocument();
    });
  });

  it('should be able to not display the insertion of contractual conditions', async () => {
    jest
      .spyOn(ProposalApi, 'putProposal')
      .mockImplementation(() => Promise.resolve(mockResult));
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    jest.spyOn(CanAuthorizeApi, 'getCanAuthorize').mockImplementation(() =>
      Promise.resolve({
        isAutomaticPolicy: true,
        issueMessage: '',
        hasOnlyFinancialPending: true,
      }),
    );
    await store.dispatch(
      quoteSliceActions.setPolicyholder({
        ...policyholderDetailsMock.registrationData,
        disabledFeatures: {
          forcedInternalization: false,
          policyInProgress: false,
          customClauses: true,
        },
      }),
    );
    const { queryByTestId } = render(
      <InsuredDataForm name="InsuredDataForm" />,
    );
    await waitFor(async () => {
      await expect(
        queryByTestId('contractualConditions-toggle-show'),
      ).not.toBeInTheDocument();
    });
  });
});
