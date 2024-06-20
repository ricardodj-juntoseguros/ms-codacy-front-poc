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
  renewalDocumentListMock,
} from '../../../__mocks__';
import { act, fireEvent, render, waitFor } from '../../../config/testUtils';
import { store } from '../../../config/store';
import InsuredDataServiceProviderWithRenewalForm from './InsuredDataServiceProviderWithRenewalForm';
import PolicyRenewalApi from '../../../application/features/policyRenewal/PolicyRenewalApi';
import { policyRenewalActions } from '../../../application/features/policyRenewal/PolicyRenewalSlice';
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

describe('InsuredDataServiceProviderWithRenewalForm', () => {
  let contractualConditionApiMock: jest.SpyInstance;
  let getRenewalDocumentListMock: jest.SpyInstance;
  const mockResult = {
    ProposalId: 12345,
    PolicyId: 11111,
    QuotationId: 12223,
    NewQuoterId: 123333,
    createdAt: '2024-01-01T12:00:00.000Z',
  };

  beforeEach(() => {
    store.dispatch(contractualConditionActions.clearContractualConditions());
    jest.clearAllMocks();
    contractualConditionApiMock = jest
      .spyOn(ContractualConditionApi, 'getCustomClause')
      .mockImplementation(() => Promise.resolve(customClauseMock));
    getRenewalDocumentListMock = jest
      .spyOn(PolicyRenewalApi, 'getRenewalDocumentList')
      .mockImplementation(() => Promise.resolve(renewalDocumentListMock));
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
    const { getByTestId } = render(
      <InsuredDataServiceProviderWithRenewalForm name="InsuredDataServiceProviderWithRenewalForm" />,
    );
    const biddingNumberInput = getByTestId('noticeData-biddingNumber-input');
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
    await store.dispatch(policyRenewalActions.setIsPolicyRenewal(true));
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    const { getByTestId, getAllByText, getByText } = render(
      <InsuredDataServiceProviderWithRenewalForm name="InsuredDataServiceProviderWithRenewalForm" />,
    );
    await waitFor(async () => {
      await expect(getRenewalDocumentListMock).toHaveBeenCalled();
    });
    const checkboxMulti = getByTestId(
      'policyRenewalDocuments-documents-checkbox-multi-select',
    );
    fireEvent.click(checkboxMulti);
    await waitFor(async () => {
      const checkBoxAdittionTerm = getAllByText('Termo de aditamento');
      await fireEvent.click(checkBoxAdittionTerm[0]);
    });
    const inputAddittionTerm = await getByTestId(
      'policyRenewalDocuments-Termo de aditamento-input',
    );
    fireEvent.change(inputAddittionTerm, {
      target: { value: 'Test Adittion Term' },
    });
    fireEvent.blur(inputAddittionTerm);
    const checkBoxOrdinaryNumbering = await getByText('Formato numérico');
    fireEvent.click(checkBoxOrdinaryNumbering);
    // Assert
    const { policyRenewal } = store.getState();
    expect(policyRenewal.documentList[9]).toEqual({
      id: 10,
      description: 'Termo de aditamento',
      hasChoiceOfNumberingType: true,
      active: true,
      inputValue: 'Test Adittion Term',
      hasOrdinaryNumbering: true,
      value: '10',
      label: 'Termo de aditamento',
      disabled: false,
    });
    expect(createProposalMock).toBeCalled();
    const submitButton = getByTestId('insuredDataFooter-submit-button');
    await waitFor(async () => {
      await expect(contractualConditionApiMock).toHaveBeenCalled();
    });
    store.dispatch(proposalActions.setInsured(insuredMock));
    store.dispatch(proposalActions.setInsuredAddress(insuredMock.addresses[0]));
    store.dispatch(proposalActions.setBiddingNumber('123456'));
    expect(submitButton).not.toBeDisabled();
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
    const { getByTestId } = render(
      <InsuredDataServiceProviderWithRenewalForm name="InsuredDataServiceProviderWithRenewalForm" />,
    );
    const objectPreviewButton = getByTestId(
      'insuredDataFooter-show-object-preview-button',
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
    const { getByTestId } = render(
      <InsuredDataServiceProviderWithRenewalForm name="InsuredDataServiceProviderWithRenewalForm" />,
    );
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
      <InsuredDataServiceProviderWithRenewalForm name="InsuredDataServiceProviderWithRenewalForm" />,
    );
    await waitFor(async () => {
      await expect(
        queryByTestId('contractualConditions-toggle-show'),
      ).not.toBeInTheDocument();
    });
  });
});
