/* eslint-disable prefer-promise-reject-errors */
import '@testing-library/jest-dom';
import { startOfDay } from 'date-fns';
import { makeToast } from 'junto-design-system';
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
import { postQuotation } from '../../../application/features/quote/QuoteSlice';
import { parseDateToString } from '../../../helpers';
import AdditionalDataForm from './AdditionalDataForm';
import { act, fireEvent, render, waitFor } from '../../../config/testUtils';
import CanAuthorizeApi from '../../../application/features/canAuthorize/CanAuthorizeApi';

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
    await store.dispatch(proposalActions.setFirstDueDate(todayFormatted));
  });

  afterEach(() => {
    store.dispatch(proposalActions.clearProposal());
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
      <AdditionalDataForm name="AdditionalDataForm" />,
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
    expect(advanceStepMock).toHaveBeenCalledWith('AdditionalDataForm');
    expect(mockHistoryPush).toHaveBeenCalledWith('/success');
  });

  // it('should be able to render the internalization screen if the response is internalization', async () => {
  //   const postIssuanceMock = jest
  //     .spyOn(IssuanceApi, 'postIssuance')
  //     .mockImplementation(() =>
  //       Promise.resolve({
  //         createdAt: '2024-01-17T14:36:51.3166667',
  //         issued: true,
  //         issuedAt: '2024-01-17T14:40:24.683',
  //         protocols: [
  //           {
  //             number: '4280784',
  //             dateTime: '2024-01-17T14:36:51.3166667',
  //             text: 'Proposta 4280784, 17/01/2024 às 14h36',
  //           },
  //           {
  //             number: '02-0775-0991403',
  //             dateTime: '2024-01-17T14:40:24.683',
  //             text: 'Contratada em 17/01/2024, às 14h36',
  //           },
  //         ],
  //         status: 3,
  //       }),
  //     );
  //   const { getByTestId } = render(
  //     <AdditionalDataForm name="AdditionalDataForm" />,
  //   );
  //   await waitFor(async () => {
  //     await expect(getProposalDraftMock).toHaveBeenCalled();
  //   });
  //   const submitButton = getByTestId('additionalDataForm-submit-button');
  //   await act(async () => {
  //     await fireEvent.click(submitButton);
  //   });
  //   await waitFor(
  //     async () => await expect(postIssuanceMock).toHaveBeenCalled(),
  //   );
  //   expect(advanceStepMock).toHaveBeenCalledWith('AdditionalDataForm');
  //   expect(mockHistoryPush).toHaveBeenCalledWith('/analysis');
  // });

  it('should be able to access the link as a certificate of regularity', async () => {
    const { getByTestId } = render(
      <AdditionalDataForm name="AdditionalDataForm" />,
    );
    await waitFor(async () => {
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

  it('should be able to render the financial pending screen if the authorize response has financial pending', async () => {
    store.dispatch(proposalActions.setHasOnlyFinancialPending(true));
    const { getByTestId } = render(
      <AdditionalDataForm name="AdditionalDataForm" />,
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
      <AdditionalDataForm name="AdditionalDataForm" />,
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

  it('should be able to render an error if get proposal draft fails', async () => {
    getProposalDraftMock = jest
      .spyOn(ProposalApi, 'getProposalDraft')
      .mockImplementation(() => Promise.reject({ data: { message: 'error' } }));
    render(<AdditionalDataForm name="AdditionalDataForm" />);
    await waitFor(async () => {
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
