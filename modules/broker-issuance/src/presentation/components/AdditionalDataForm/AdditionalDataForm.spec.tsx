/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { startOfDay } from 'date-fns';
import { makeToast } from 'junto-design-system';
import IssuanceApi from '../../../application/features/issuance/IssuanceApi';
import CanAuthorizeApi from '../../../application/features/canAuthorize/CanAuthorizeApi';
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
  quoteResulMock,
} from '../../../__mocks__';
import { postQuotation } from '../../../application/features/quote/QuoteSlice';
import { parseDateToString } from '../../../helpers';
import AdditionalDataForm from './AdditionalDataForm';
import { act, fireEvent, render, waitFor } from '../../../config/testUtils';

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

const createProposalMock = jest.fn();
jest.mock('../../hooks', () => {
  const rest = jest.requireActual('../../hooks');
  return {
    ...rest,
    useProposal: () => createProposalMock,
  };
});

describe('AdditionalDataForm', () => {
  process.env.NX_GLOBAL_CERTIFICATE_REGULARITY = 'CERTIFICATE_REGULARITY';
  let getCanAuthorizeMock: any = null;
  let getProposalDraftMock: any = null;
  const windowOpen = jest.fn();
  window.open = windowOpen;

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
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResulMock);
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
    await store.dispatch(
      proposalActions.setPaymentType({
        label: 'Boleto',
        value: '1',
      }),
    );
    await store.dispatch(
      proposalActions.setNumberOfInstallments({
        label: 'À vista em R$ 190,00',
        value: '1',
      }),
    );
    const todayFormatted = parseDateToString(startOfDay(new Date()));
    await store.dispatch(proposalActions.setFirstDueDate(todayFormatted));
  });

  beforeEach(() => {
    jest.clearAllMocks();
    getCanAuthorizeMock = jest
      .spyOn(CanAuthorizeApi, 'getCanAuthorize')
      .mockImplementation(() =>
        Promise.resolve({
          isAutomaticPolicy: true,
          issueMessage: '',
          hasOnlyFinancialPending: false,
        }),
      );
    getProposalDraftMock = jest
      .spyOn(ProposalApi, 'getProposalDraft')
      .mockImplementation(() =>
        Promise.resolve({
          draftLink: 'draftLink',
        }),
      );
  });

  it('should be able to include a comment', () => {
    const { getByTestId } = render(
      <AdditionalDataForm name="AdditionalDataForm" />,
    );
    const textArea = getByTestId('additionalDataForm-text-area-comments');
    fireEvent.change(textArea, { target: { value: 'comment' } });
    fireEvent.blur(textArea);
    const state = store.getState();
    expect(state.proposal.comments).toBe('comment');
    expect(createProposalMock).toHaveBeenCalled();
  });

  it('should be able to render the success screen if the response is success', async () => {
    const dateNow = new Date().toISOString();
    const postIssuanceMock = jest
      .spyOn(IssuanceApi, 'postIssuance')
      .mockImplementation(() =>
        Promise.resolve({
          issued: true,
          issuedAt: dateNow,
        }),
      );
    const { getByTestId } = render(
      <AdditionalDataForm name="AdditionalDataForm" />,
    );
    await waitFor(async () => {
      await expect(getCanAuthorizeMock).toHaveBeenCalled();
      await expect(getProposalDraftMock).toHaveBeenCalled();
    });
    const submitButton = getByTestId('additionalDataForm-submit-button');
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    const state = store.getState();
    await waitFor(
      async () => await expect(postIssuanceMock).toHaveBeenCalled(),
    );
    expect(state.proposal.issuedAt).toEqual(dateNow);
    expect(advanceStepMock).toHaveBeenCalledWith('AdditionalDataForm');
    expect(mockHistoryPush).toHaveBeenCalledWith('/success');
  });

  it('should be able to render the internalization screen if the response is internalization', async () => {
    const postIssuanceMock = jest
      .spyOn(IssuanceApi, 'postIssuance')
      .mockImplementation(() =>
        Promise.resolve({
          issued: false,
          issuedAt: null,
        }),
      );
    const { getByTestId } = render(
      <AdditionalDataForm name="AdditionalDataForm" />,
    );
    await waitFor(async () => {
      await expect(getCanAuthorizeMock).toHaveBeenCalled();
      await expect(getProposalDraftMock).toHaveBeenCalled();
    });
    const submitButton = getByTestId('additionalDataForm-submit-button');
    await act(async () => {
      await fireEvent.click(submitButton);
    });
    const state = store.getState();
    await waitFor(
      async () => await expect(postIssuanceMock).toHaveBeenCalled(),
    );
    expect(state.proposal.issuedAt).toEqual(null);
    expect(advanceStepMock).toHaveBeenCalledWith('AdditionalDataForm');
    expect(mockHistoryPush).toHaveBeenCalledWith('/analysis');
  });

  it('should be able to access the link as a certificate of regularity', async () => {
    const { getByTestId } = render(
      <AdditionalDataForm name="AdditionalDataForm" />,
    );
    await waitFor(async () => {
      await expect(getCanAuthorizeMock).toHaveBeenCalled();
      await expect(getProposalDraftMock).toHaveBeenCalled();
    });
    const certificateRegularityButton = getByTestId(
      'additionalDataForm-certificate-regularity-button',
    );
    await act(async () => {
      await fireEvent.click(certificateRegularityButton);
    });
    expect(windowOpen).toHaveBeenCalledWith('CERTIFICATE_REGULARITY', '_blank');
  });

  it('should be able to open the terms and conditions modal', async () => {
    const { getByTestId } = render(
      <AdditionalDataForm name="AdditionalDataForm" />,
    );
    await waitFor(async () => {
      await expect(getCanAuthorizeMock).toHaveBeenCalled();
      await expect(getProposalDraftMock).toHaveBeenCalled();
    });
    const termsModalButton = getByTestId(
      'additionalDataForm-terms-modal-button',
    );
    await act(async () => {
      await fireEvent.click(termsModalButton);
    });
    expect(
      getByTestId('termsOfAcceptanceModal-button-close'),
    ).toBeInTheDocument();
  });

  it('should be able to render the internalization screen if the response is internalization', async () => {
    getCanAuthorizeMock = jest
      .spyOn(CanAuthorizeApi, 'getCanAuthorize')
      .mockImplementation(() =>
        Promise.resolve({
          isAutomaticPolicy: true,
          issueMessage: '',
          hasOnlyFinancialPending: true,
        }),
      );
    const { getByTestId } = render(
      <AdditionalDataForm name="AdditionalDataForm" />,
    );
    await waitFor(async () => {
      await expect(getCanAuthorizeMock).toHaveBeenCalled();
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
    getCanAuthorizeMock = jest
      .spyOn(CanAuthorizeApi, 'getCanAuthorize')
      .mockImplementation(() =>
        Promise.resolve({
          isAutomaticPolicy: false,
          issueMessage: '',
          hasOnlyFinancialPending: false,
        }),
      );
    const { getByText } = render(
      <AdditionalDataForm name="AdditionalDataForm" />,
    );
    await waitFor(async () => {
      await expect(getCanAuthorizeMock).toHaveBeenCalled();
      await expect(getProposalDraftMock).toHaveBeenCalled();
    });
    expect(getByText('Envio de documentos')).toBeInTheDocument();
    expect(
      getByText(
        'Precisaremos de alguns documentos para analisar sua proposta. Por favor, anexe abaixo:',
      ),
    ).toBeInTheDocument();
  });

  it('should be able to render an error if get can authorize fails', async () => {
    getCanAuthorizeMock = jest
      .spyOn(CanAuthorizeApi, 'getCanAuthorize')
      .mockImplementation(() => Promise.reject({ data: { message: 'error' } }));
    render(<AdditionalDataForm name="AdditionalDataForm" />);
    await waitFor(async () => {
      await expect(getCanAuthorizeMock).toHaveBeenCalled();
      await expect(getProposalDraftMock).toHaveBeenCalled();
    });
    expect(makeToast).toHaveBeenCalledWith('error', 'error');
  });

  it('should be able to render an error if get proposal draft fails', async () => {
    getProposalDraftMock = jest
      .spyOn(ProposalApi, 'getProposalDraft')
      .mockImplementation(() => Promise.reject({ data: { message: 'error' } }));
    render(<AdditionalDataForm name="AdditionalDataForm" />);
    await waitFor(async () => {
      await expect(getCanAuthorizeMock).toHaveBeenCalled();
      await expect(getProposalDraftMock).toHaveBeenCalled();
    });
    expect(makeToast).toHaveBeenCalledWith('error', 'error');
  });

  it('should be able to render an error if post issuance fails', async () => {
    const postIssuanceMock = jest
      .spyOn(IssuanceApi, 'postIssuance')
      .mockImplementation(() => Promise.reject({ data: { message: 'error' } }));
    const { getByTestId } = render(
      <AdditionalDataForm name="AdditionalDataForm" />,
    );
    await waitFor(async () => {
      await expect(getCanAuthorizeMock).toHaveBeenCalled();
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
});
