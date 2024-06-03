/* eslint-disable prefer-promise-reject-errors */
import { ThemeProvider, Themes, ToastContainer } from 'junto-design-system';
import { Provider } from 'react-redux';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import { renderHook } from '@testing-library/react-hooks';
import { commercialAuthorizationActions } from '../../../application/features/CommercialAuthorization/CommercialAuthorizationSlice';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import { postQuotation } from '../../../application/features/quote/QuoteSlice';
import { proposalActions } from '../../../application/features/proposal/ProposalSlice';
import IssuanceApi from '../../../application/features/issuance/IssuanceApi';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import { createQuoteMock, quoteResultMock } from '../../../__mocks__';
import { store } from '../../../config/store';
import { useIssuance } from './useIssuance';
import { issuanceActions } from '../../../application/features/issuance/IssuanceSlice';

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

const mockHistoryPush = jest.fn();
jest.mock('react-router', () => ({
  ...(jest.requireActual('react-router') as any),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});

describe('useIssuance', () => {
  const HookWrapper: React.FC = ({ children }) => {
    return (
      <ThemeProvider theme={Themes.DEFAULT}>
        <Provider store={store}>{children}</Provider>
        <ToastContainer />
      </ThemeProvider>
    );
  };
  const mockResult = {
    createdAt: new Date().toISOString(),
    issued: true,
    issuedAt: '2024-01-29T11:27:00.63',
    protocols: [
      {
        number: '4283162',
        dateTime: new Date().toISOString(),
        text: 'Proposta 4283162, 29/01/2024 às 11h26',
      },
      {
        number: '02-0775-0991777',
        dateTime: '2024-01-29T11:27:00.63',
        text: 'Contratada em 29/01/2024, às 11h26',
      },
    ],
    status: 3,
  };
  let postIssuanceMock = jest
    .spyOn(IssuanceApi, 'postIssuance')
    .mockImplementation(async () => mockResult);
  let submitToApprovalMock = jest
    .spyOn(ProposalApi, 'submitToApproval')
    .mockImplementation(async () => mockResult);

  beforeEach(() => {
    jest.clearAllMocks();
    store.dispatch(proposalActions.clearProposal());
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.BROKER);
    store.dispatch(postQuotation(createQuoteMock));
    store.dispatch(proposalActions.setIsAutomaticPolicy(true));
    store.dispatch(proposalActions.setComments('comments'));
  });

  it('should be able to successfully issue a proposal', async () => {
    const { result } = renderHook(() => useIssuance(), {
      wrapper: HookWrapper,
    });
    await result.current[0]('stepName');
    expect(postIssuanceMock).toHaveBeenCalledWith(1397190, {
      acceptTermsId: null,
      approvalContacts: [],
      comments: 'comments',
      contacts: [],
      internalizedReason: '',
      isAutomatic: true,
    });
    expect(advanceStepMock).toHaveBeenCalledWith('stepName');
    const state = store.getState();
    expect(state.proposal.issuedAt).toEqual(mockResult.issuedAt);
    expect(state.proposal.protocols).toEqual(mockResult.protocols);
    expect(mockHistoryPush).toHaveBeenCalledWith('/success');
  });

  it('should be able to submit a proposal for analysis', async () => {
    postIssuanceMock = jest
      .spyOn(IssuanceApi, 'postIssuance')
      .mockImplementation(async () => ({
        ...mockResult,
        issued: false,
      }));
    const { result } = renderHook(() => useIssuance(), {
      wrapper: HookWrapper,
    });
    await result.current[0]('stepName');
    expect(postIssuanceMock).toHaveBeenCalledWith(1397190, {
      acceptTermsId: null,
      approvalContacts: [],
      comments: 'comments',
      contacts: [],
      internalizedReason: '',
      isAutomatic: true,
    });
    expect(advanceStepMock).toHaveBeenCalledWith('stepName');
    const state = store.getState();
    expect(state.proposal.issuedAt).toEqual(mockResult.issuedAt);
    expect(state.proposal.protocols).toEqual(mockResult.protocols);
    expect(mockHistoryPush).toHaveBeenCalledWith('/analysis');
  });

  it('should be able to show an error if the issuance call fails', async () => {
    postIssuanceMock = jest
      .spyOn(IssuanceApi, 'postIssuance')
      .mockImplementation(async () =>
        Promise.reject({ data: { message: 'error' } }),
      );
    const { result } = renderHook(() => useIssuance(), {
      wrapper: HookWrapper,
    });
    await result.current[0]('stepName');
    expect(postIssuanceMock).toHaveBeenCalledWith(1397190, {
      acceptTermsId: null,
      approvalContacts: [],
      comments: 'comments',
      contacts: [],
      internalizedReason: '',
      isAutomatic: true,
    });
    expect(advanceStepMock).not.toHaveBeenCalled();
    const state = store.getState();
    expect(state.proposal.issuedAt).toEqual('');
    expect(state.proposal.protocols).toEqual([]);
    expect(mockHistoryPush).not.toHaveBeenCalled();
  });

  it('should be able to use commercial login to send a proposal for approval', async () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.COMMERCIAL);
    store.dispatch(
      commercialAuthorizationActions.setApprovalContacts([
        'test@juntoseguros.com',
      ]),
    );
    const { result } = renderHook(() => useIssuance(), {
      wrapper: HookWrapper,
    });
    await result.current[0]('stepName');
    expect(submitToApprovalMock).toHaveBeenCalledWith(1397190, {
      acceptTermsId: null,
      approvalContacts: ['test@juntoseguros.com'],
      comments: 'comments',
      contacts: [],
      internalizedReason: '',
      isAutomatic: true,
    });
    expect(advanceStepMock).toHaveBeenCalledWith('stepName');
    const state = store.getState();
    expect(state.proposal.issuedAt).toEqual(mockResult.issuedAt);
    expect(state.proposal.protocols).toEqual(mockResult.protocols);
    expect(mockHistoryPush).toHaveBeenCalledWith('/send-to-approval');
  });

  it('should be able to show an error if the submit call for approval fails', async () => {
    submitToApprovalMock = jest
      .spyOn(ProposalApi, 'submitToApproval')
      .mockImplementation(async () =>
        Promise.reject({ data: { message: 'error' } }),
      );
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.COMMERCIAL);
    store.dispatch(
      commercialAuthorizationActions.setApprovalContacts([
        'test@juntoseguros.com',
      ]),
    );
    const { result } = renderHook(() => useIssuance(), {
      wrapper: HookWrapper,
    });
    await result.current[0]('stepName');
    expect(submitToApprovalMock).toHaveBeenCalledWith(1397190, {
      acceptTermsId: null,
      approvalContacts: ['test@juntoseguros.com'],
      comments: 'comments',
      contacts: [],
      internalizedReason: '',
      isAutomatic: true,
    });
    expect(advanceStepMock).not.toHaveBeenCalled();
    const state = store.getState();
    expect(state.proposal.issuedAt).toEqual('');
    expect(state.proposal.protocols).toEqual([]);
    expect(mockHistoryPush).not.toHaveBeenCalledWith();
  });

  it('Should send proposal to approval if user profile is POLICYHOLDER and does not have issue permission', async () => {
    submitToApprovalMock = jest
      .spyOn(ProposalApi, 'submitToApproval')
      .mockImplementation(async () => mockResult);
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.POLICYHOLDER);
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserAccessCookie')
      .mockImplementation(() => ({
        token: 'token',
        refreshToken: 'refreshtoken',
        tokenType: 'Bearer',
        createAt: '2024-02-15T17:12:53.587Z',
        useRefreshToken: true,
        expiresIn: 900000,
        refreshExpiresIn: 1800000,
        userId: '65508672-5b7b-410b-84c2-be129daa86d1',
        email: 'ti_homologacao@juntoseguros.com',
        username: 'falcaocwb_tom',
        userTheme: null,
        permissions: ['permission.policyholder.reports'],
        broker: {
          id: 1,
          externalId: 268010,
          name: 'teste corretor 1 (PR)',
          userId: 1,
          federalId: '06465132135429',
          susepId: '2000000000',
          user: {
            id: 8569,
            userName: 'falcaocwb_tom',
            userType: 1,
            userTypeDescription: 'Tomador',
          },
        },
        isSusepValidated: false,
      }));
    const { result } = renderHook(() => useIssuance(), {
      wrapper: HookWrapper,
    });
    await result.current[0]('stepName');
    expect(submitToApprovalMock).toHaveBeenCalledWith(1397190, {
      acceptTermsId: null,
      approvalContacts: [],
      comments: 'comments',
      contacts: [],
      internalizedReason: '',
      isAutomatic: true,
    });
  });

  it('should call issuance api correctly if is commercial profile and force internalization is on', async () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.COMMERCIAL);
    store.dispatch(issuanceActions.setForceInternalize(true));
    store.dispatch(
      issuanceActions.setInternalizeReason('test internalize reason'),
    );
    const { result } = renderHook(() => useIssuance(), {
      wrapper: HookWrapper,
    });
    await result.current[0]('stepName');
    expect(postIssuanceMock).toHaveBeenCalledWith(1397190, {
      acceptTermsId: null,
      approvalContacts: [],
      comments: 'comments',
      contacts: [],
      internalizedReason: 'PALAVRAS DO COMERCIAL: test internalize reason',
      isAutomatic: false,
    });
  });
});
