import { renderHook } from '@testing-library/react-hooks';
import { ThemeProvider, Themes } from 'junto-design-system';
import { Provider } from 'react-redux';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { waitFor } from '@testing-library/react';
import {
  contractualConditionActions,
  patchCustomClause,
  postCustomClause,
} from '../../../application/features/contractualCondition/ContractualConditionSlice';
import ContractualConditionApi from '../../../application/features/contractualCondition/ContractualConditionApi';
import CanAuthorizeApi from '../../../application/features/canAuthorize/CanAuthorizeApi';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import { store } from '../../../config/store';
import { useProposal } from './useProposal';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import {
  brokerMock,
  createQuoteMock,
  customClauseMock,
  insuredMock,
  modalityBidderMock,
  quoteResultMock,
} from '../../../__mocks__';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';

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

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});

describe('useProposal', () => {
  const HookWrapper: React.FC = ({ children }) => {
    return (
      <ThemeProvider theme={Themes.DEFAULT}>
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    );
  };
  const mockResult = {
    ProposalId: 12345,
    PolicyId: 11111,
    QuotationId: 12223,
    NewQuoterId: 123333,
    createdAt: '2024-01-01T12:00:00.000Z',
  };
  const firstDueDateMock = new Date().toISOString();
  const putProposalMock = jest
    .spyOn(ProposalApi, 'putProposal')
    .mockImplementation(() => Promise.resolve(mockResult));
  const canAuthorizeProposalMock = jest
    .spyOn(CanAuthorizeApi, 'getCanAuthorize')
    .mockImplementation(() =>
      Promise.resolve({
        isAutomaticPolicy: true,
        issueMessage: '',
        hasOnlyFinancialPending: false,
      }),
    );
  const postCustomClauseMock = jest
    .spyOn(ContractualConditionApi, 'postCustomClause')
    .mockImplementation(() => Promise.resolve(customClauseMock[0]));
  const patchCustomClausMock = jest
    .spyOn(ContractualConditionApi, 'patchCustomClause')
    .mockImplementation(() => Promise.resolve());

  beforeAll(async () => {
    jest.clearAllMocks();
    store.dispatch(proposalActions.clearProposal());
    jest.spyOn(QuoteApi, 'postQuotation').mockImplementation(async () => ({
      ...quoteResultMock,
      installmentOptions: quoteResultMock.installmentOptions.map(option => ({
        ...option,
        firstDueDate: firstDueDateMock,
      })),
    }));
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.BROKER);
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockReturnValue(brokerMock);
    store.dispatch(postQuotation(createQuoteMock));
    store.dispatch(quoteSliceActions.setModality(modalityBidderMock));
    store.dispatch(proposalActions.setInsured(insuredMock));
    store.dispatch(proposalActions.setInsuredAddress(insuredMock.addresses[0]));
    store.dispatch(proposalActions.setBiddingNumber('123456'));
  });

  it('should be able to update a proposal', async () => {
    const { result } = renderHook(() => useProposal(), {
      wrapper: HookWrapper,
    });
    await result.current('name');
    expect(putProposalMock).toHaveBeenCalledWith(90408, {
      biddingDescription: '',
      biddingNumber: '123456',
      brokerFederalId: '06465132135429',
      contacts: [],
      insured: { addressId: 5539, federalId: '42498733000148', id: 6455 },
      observations: '',
      selectedInstallmentOptions: {
        firstDueDate: firstDueDateMock,
        numberOfInstallments: 1,
        paymentType: 1,
      },
    });
    waitFor(async () => {
      await expect(canAuthorizeProposalMock).toHaveBeenCalledWith(11111);
    });
    const state = store.getState();
    expect(state.proposal.isAutomaticPolicy).toBe(true);
    expect(state.proposal.hasOnlyFinancialPending).toBe(false);
    expect(state.proposal.createProposalSuccess).toBe(false);
    expect(advanceStepMock).toHaveBeenCalledWith('name');
  });

  it('should be able to add a custom clause', async () => {
    store.dispatch(contractualConditionActions.setRequestedBy('1'));
    store.dispatch(contractualConditionActions.setText('test'));
    const { result } = renderHook(() => useProposal(), {
      wrapper: HookWrapper,
    });
    await result.current('name');
    expect(putProposalMock).toHaveBeenCalledWith(90408, {
      biddingDescription: '',
      biddingNumber: '123456',
      brokerFederalId: '06465132135429',
      contacts: [],
      insured: { addressId: 5539, federalId: '42498733000148', id: 6455 },
      observations: '',
      selectedInstallmentOptions: {
        firstDueDate: firstDueDateMock,
        numberOfInstallments: 1,
        paymentType: 1,
      },
    });
    expect(postCustomClauseMock).toHaveBeenCalledWith(11111, 1, 'test');
    waitFor(async () => {
      await expect(canAuthorizeProposalMock).toHaveBeenCalledTimes(1);
      await expect(canAuthorizeProposalMock).toHaveBeenCalledWith(11111);
    });
    const state = store.getState();
    expect(state.proposal.isAutomaticPolicy).toBe(true);
    expect(state.proposal.hasOnlyFinancialPending).toBe(false);
    expect(state.proposal.createProposalSuccess).toBe(false);
    expect(advanceStepMock).toHaveBeenCalledWith('name');
  });

  it('should be able to update a custom clause', async () => {
    store.dispatch(contractualConditionActions.setRequestedBy('1'));
    store.dispatch(contractualConditionActions.setText('test'));
    store.dispatch(
      postCustomClause({ policyId: 11111, requestedBy: 1, text: 'test' }),
    );
    store.dispatch(contractualConditionActions.setText('test patch'));
    const { result } = renderHook(() => useProposal(), {
      wrapper: HookWrapper,
    });
    await result.current('name');
    expect(putProposalMock).toHaveBeenCalledWith(90408, {
      biddingDescription: '',
      biddingNumber: '123456',
      brokerFederalId: '06465132135429',
      contacts: [],
      insured: { addressId: 5539, federalId: '42498733000148', id: 6455 },
      observations: '',
      selectedInstallmentOptions: {
        firstDueDate: firstDueDateMock,
        numberOfInstallments: 1,
        paymentType: 1,
      },
    });
    expect(patchCustomClausMock).toHaveBeenCalledWith(
      1341,
      false,
      1,
      'test patch',
    );
    waitFor(async () => {
      await expect(canAuthorizeProposalMock).toHaveBeenCalledTimes(1);
      await expect(canAuthorizeProposalMock).toHaveBeenCalledWith(11111);
    });
    const state = store.getState();
    expect(state.proposal.isAutomaticPolicy).toBe(true);
    expect(state.proposal.hasOnlyFinancialPending).toBe(false);
    expect(state.proposal.createProposalSuccess).toBe(false);
    expect(advanceStepMock).toHaveBeenCalledWith('name');
  });
});
