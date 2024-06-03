/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { startOfDay } from 'date-fns';
import { makeToast } from 'junto-design-system';
import { BrokerPlatformAuthService, ProfileEnum } from '@services';
import IssuanceApi from '../../../application/features/issuance/IssuanceApi';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import { store } from '../../../config/store';
import {
  proposalActions,
  putProposal,
} from '../../../application/features/proposal/ProposalSlice';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import {
  createQuoteMock,
  proposalMock,
  quoteResultMock,
} from '../../../__mocks__';
import {
  postQuotation,
  quoteSliceActions,
} from '../../../application/features/quote/QuoteSlice';
import { parseDateToString } from '../../../helpers';
import AdditionalDataCommercialInternalizeForm from './AdditionalDataCommercialInternalizeForm';
import { act, fireEvent, render, waitFor } from '../../../config/testUtils';
import CanAuthorizeApi from '../../../application/features/canAuthorize/CanAuthorizeApi';
import { issuanceActions } from '../../../application/features/issuance/IssuanceSlice';
import { PolicyholderModel } from '../../../application/types/model';

jest.mock('junto-design-system', () => {
  const original = jest.requireActual('junto-design-system');
  return {
    ...original,
    makeToast: jest.fn(),
  };
});

const mockHistoryPush = jest.fn();
jest.mock('react-router', () => ({
  ...(jest.requireActual('react-router') as any),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

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

describe('AdditionalDataCommercialInternalizeForm', () => {
  let getProposalDraftMock: any = null;
  beforeAll(async () => {
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

  beforeEach(async () => {
    jest.clearAllMocks();
    getProposalDraftMock = jest
      .spyOn(ProposalApi, 'getProposalDraft')
      .mockImplementation(() =>
        Promise.resolve({
          draftLink: 'draftLink',
        }),
      );
    jest.spyOn(CanAuthorizeApi, 'getCanAuthorize').mockImplementation(() =>
      Promise.resolve({
        isAutomaticPolicy: true,
        issueMessage: '',
        hasOnlyFinancialPending: false,
      }),
    );
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    await store.dispatch(postQuotation(createQuoteMock));
    jest.spyOn(ProposalApi, 'putProposal').mockImplementation(() =>
      Promise.resolve({
        ProposalId: 12345,
        PolicyId: 11111,
        QuotationId: 12223,
        NewQuoterId: 123333,
        createdAt: '2021-01-01T00:00:00',
      }),
    );
    await store.dispatch(
      putProposal({ proposalId: 12345, proposalData: proposalMock }),
    );
    store.dispatch(proposalActions.setPaymentType(1));
    store.dispatch(proposalActions.setNumberOfInstallments(1));
    const todayFormatted = parseDateToString(startOfDay(new Date()));
    store.dispatch(proposalActions.setFirstDueDate(todayFormatted));
  });

  afterEach(() => {
    store.dispatch(proposalActions.clearProposal());
  });

  it('should be able to render the success screen if the submit response is success', async () => {
    const postIssuanceMock = jest
      .spyOn(IssuanceApi, 'postIssuance')
      .mockImplementation(() =>
        Promise.resolve({
          createdAt: '2024-01-17T14:36:51.3166667',
          issued: true,
          issuedAt: '2024-01-17T14:40:24.683',
          protocols: [
            {
              number: '4280784',
              dateTime: '2024-01-17T14:36:51.3166667',
              text: 'Proposta 4280784, 17/01/2024 às 14h36',
            },
            {
              number: '02-0775-0991403',
              dateTime: '2024-01-17T14:40:24.683',
              text: 'Contratada em 17/01/2024, às 14h36',
            },
          ],
          status: 3,
        }),
      );
    const { getByTestId } = render(
      <AdditionalDataCommercialInternalizeForm name="AdditionalDataCommercialInternalizeForm" />,
    );
    await waitFor(async () => {
      await expect(getProposalDraftMock).toHaveBeenCalled();
    });
    const submitButton = getByTestId('additionalDataForm-submit-button');
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    await waitFor(
      async () => await expect(postIssuanceMock).toHaveBeenCalled(),
    );
    expect(advanceStepMock).toHaveBeenCalledWith(
      'AdditionalDataCommercialInternalizeForm',
    );
    expect(mockHistoryPush).toHaveBeenCalledWith('/success');
  });

  it('should be able to render the financial pending screen if the authorize response has financial pending', async () => {
    store.dispatch(proposalActions.setHasOnlyFinancialPending(true));
    const { getByTestId } = render(
      <AdditionalDataCommercialInternalizeForm name="AdditionalDataCommercialInternalizeForm" />,
    );
    await waitFor(async () => {
      await expect(getProposalDraftMock).toHaveBeenCalled();
    });
    const submitButton = getByTestId('additionalDataForm-submit-button');
    expect(submitButton).not.toBeDisabled();
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    expect(mockHistoryPush).toHaveBeenCalledWith('/financial-pending');
  });

  it('should be able to render the internalization screen if the response is internalization', async () => {
    store.dispatch(proposalActions.setIsAutomaticPolicy(false));
    const { getByText } = render(
      <AdditionalDataCommercialInternalizeForm name="AdditionalDataCommercialInternalizeForm" />,
    );
    await waitFor(async () => {
      await expect(getProposalDraftMock).toHaveBeenCalled();
    });
    expect(getByText('Envio de documentos')).toBeInTheDocument();
    expect(
      getByText(
        'Precisaremos de alguns documentos para analisar sua proposta. Por favor, anexe abaixo:',
      ),
    ).toBeInTheDocument();
  });

  it('should be able to render an error if post issuance fails', async () => {
    const postIssuanceMock = jest
      .spyOn(IssuanceApi, 'postIssuance')
      .mockImplementation(() => Promise.reject({ data: { message: 'error' } }));
    const { getByTestId } = render(
      <AdditionalDataCommercialInternalizeForm name="AdditionalDataCommercialInternalizeForm" />,
    );
    await waitFor(async () => {
      await expect(getProposalDraftMock).toHaveBeenCalled();
    });
    const submitButton = getByTestId('additionalDataForm-submit-button');
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    await waitFor(
      async () => await expect(postIssuanceMock).toHaveBeenCalled(),
    );
    expect(makeToast).toHaveBeenCalledWith('error', 'error');
  });

  it('should be able to render commercial authorization component if user is commercial and is automatic policy', async () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.COMMERCIAL);
    store.dispatch(proposalActions.setIsAutomaticPolicy(true));
    const { getByText } = render(
      <AdditionalDataCommercialInternalizeForm name="AdditionalDataCommercialInternalizeForm" />,
    );
    expect(getByText('Autorizar emissão da apólice')).toBeInTheDocument();
  });

  it('should not render commercial authorization component if user is commercial and forced internalization is set to true', async () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.COMMERCIAL);
    store.dispatch(proposalActions.setIsAutomaticPolicy(true));
    store.dispatch(issuanceActions.setForceInternalize(true));
    const { queryByText } = render(
      <AdditionalDataCommercialInternalizeForm name="AdditionalDataCommercialInternalizeForm" />,
    );
    expect(queryByText('Autorizar emissão da apólice')).not.toBeInTheDocument();
  });

  it('Should render commercial internalize component if is automatic policy and user is commercial', async () => {
    jest
      .spyOn(BrokerPlatformAuthService, 'getUserProfile')
      .mockImplementation(() => ProfileEnum.COMMERCIAL);
    store.dispatch(proposalActions.setIsAutomaticPolicy(true));
    store.dispatch(
      quoteSliceActions.setPolicyholder({
        disabledFeatures: { forcedInternalization: false },
      } as PolicyholderModel),
    );
    const { getByText } = render(
      <AdditionalDataCommercialInternalizeForm name="AdditionalDataCommercialInternalizeForm" />,
    );
    expect(
      getByText('Preciso de uma análise da subscrição para este processo.'),
    ).toBeInTheDocument();
  });
});
