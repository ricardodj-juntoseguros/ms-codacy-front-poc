import '@testing-library/jest-dom';
import { downloadFile } from '@shared/utils';
import { Broker, BrokerPlatformAuthService } from '@services';
import { render, fireEvent, act, waitFor } from '../../../config/testUtils';
import ProposalFinishContainer from './ProposalFinishContainer';
import { store } from '../../../config/store';
import { postQuotation } from '../../../application/features/quote/QuoteSlice';
import {
  createQuoteMock,
  proposalMock,
  quoteResultMock,
} from '../../../__mocks__';
import QuoteApi from '../../../application/features/quote/QuoteApi';
import ProposalApi from '../../../application/features/proposal/ProposalApi';
import {
  proposalActions,
  putProposal,
} from '../../../application/features/proposal/ProposalSlice';
import CanAuthorizeApi from '../../../application/features/canAuthorize/CanAuthorizeApi';
import ProposalDocumentsApi from '../../../application/features/proposalDocuments/ProposalDocumentsApi';
import SurveysApi from '../../../application/features/surveys/SurveysApi';
import {
  ProposalFinishEnum,
  SurveyTypeEnum,
} from '../../../application/types/model';

jest.mock('@shared/utils', () => {
  const original = jest.requireActual('@shared/utils');
  return {
    ...original,
    downloadFile: jest.fn(),
  };
});

describe('ProposalFinishContainer', () => {
  process.env.NX_GLOBAL_BROKER_PROCESSES_URL = '/url-processos';
  const mockHistoryPush = jest.fn();

  beforeAll(async () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() },
    });
    jest
      .spyOn(BrokerPlatformAuthService, 'getBroker')
      .mockImplementation(() => {
        return {
          name: 'Teste corretor',
        } as Broker;
      });
    jest
      .spyOn(QuoteApi, 'postQuotation')
      .mockImplementation(async () => quoteResultMock);
    jest.spyOn(CanAuthorizeApi, 'getCanAuthorize').mockImplementation(() =>
      Promise.resolve({
        isAutomaticPolicy: true,
        issueMessage: '',
        hasOnlyFinancialPending: false,
      }),
    );
    jest.spyOn(ProposalApi, 'putProposal').mockImplementation(async () => ({
      ProposalId: 90408,
      PolicyId: 11111,
      QuotationId: 12223,
      NewQuoterId: 123333,
      createdAt: '2024-01-01T12:00:00.000Z',
    }));
    jest.spyOn(SurveysApi, 'getSurveyInvite').mockImplementation(async () => ({
      inviteId: 'invite',
      shouldAnswer: true,
    }));
    jest.spyOn(SurveysApi, 'answerSurvey').mockImplementation(async () => 'Ok');
    await store.dispatch(postQuotation(createQuoteMock));
    await store.dispatch(
      putProposal({ proposalId: 90408, proposalData: proposalMock }),
    );
    await store.dispatch(
      proposalActions.setProtocols([
        {
          number: 1,
          dateTime: new Date().toISOString(),
          text: 'Proposta 11111 - 01/01/2024 às 12h00',
        },
      ]),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render accordingly with analysis feedback type', async () => {
    const { getByText, getByTestId } = render(
      <ProposalFinishContainer
        feedbackType={ProposalFinishEnum.analysis}
        history={{ push: mockHistoryPush } as any}
        location={{} as any}
        match={{} as any}
      />,
    );
    expect(getByText('Sua solicitação está em análise')).toBeInTheDocument();
    expect(
      getByText('Proposta 11111 - 01/01/2024 às 12h00'),
    ).toBeInTheDocument();
    expect(
      getByText('Em breve você receberá o retorno da nossa equipe.'),
    ).toBeInTheDocument();
    expect(
      getByTestId('proposalFinishContainer-download-button'),
    ).toBeInTheDocument();
    expect(
      getByTestId('proposalFinishContainer-processes-button'),
    ).toBeInTheDocument();
  });

  it('Should render accordingly with success feedback type', async () => {
    const { getByText, getByTestId } = render(
      <ProposalFinishContainer
        feedbackType={ProposalFinishEnum.success}
        history={{ push: mockHistoryPush } as any}
        location={{} as any}
        match={{} as any}
      />,
    );
    expect(getByText('Sua apólice foi emitida!')).toBeInTheDocument();
    expect(
      getByText(
        'Em alguns instantes você receberá via email sua apólice de seguro e o boleto para pagamento.',
      ),
    ).toBeInTheDocument();
    expect(
      getByTestId('proposalFinishContainer-processes-button'),
    ).toBeInTheDocument();
  });

  it('Should go to process list on button click', async () => {
    const { getByTestId } = render(
      <ProposalFinishContainer
        feedbackType={ProposalFinishEnum.success}
        history={{ push: mockHistoryPush } as any}
        location={{} as any}
        match={{} as any}
      />,
    );
    const button = getByTestId('proposalFinishContainer-processes-button');
    fireEvent.click(button);
    expect(window.location.assign).toHaveBeenCalledWith('/url-processos');
  });

  it('Should call api to download proposal document on button click', async () => {
    const mockFile = {
      fieldname: 'file',
      originalname: '3880885.pdf',
      encoding: '7bit',
      mimetype: 'application/pdf',
      buffer: Buffer.alloc(253397, 1),
      size: 415423,
      stream: undefined,
      destination: undefined,
      filename: undefined,
      path: undefined,
    };
    const apiMock = jest
      .spyOn(ProposalDocumentsApi, 'getProposalDocumentForDownload')
      .mockImplementation(async () => {
        return Promise.resolve(mockFile);
      });

    const { getByTestId } = render(
      <ProposalFinishContainer
        feedbackType={ProposalFinishEnum.analysis}
        history={{ push: mockHistoryPush } as any}
        location={{} as any}
        match={{} as any}
      />,
    );
    const button = getByTestId('proposalFinishContainer-download-button');
    await act(async () => {
      await fireEvent.click(button);
    });
    expect(apiMock).toHaveBeenCalledWith(90408);
    expect(downloadFile).toHaveBeenCalledWith(new Blob(), 'proposta_11111.pdf');
  });

  it('Should call CSAT survey and answer it', async () => {
    const { findByText, getByTestId, findByPlaceholderText } = render(
      <ProposalFinishContainer
        feedbackType={ProposalFinishEnum.success}
        history={{ push: mockHistoryPush } as any}
        location={{} as any}
        match={{} as any}
      />,
    );

    await waitFor(async () => {
      expect(
        await findByText(
          'Como você avalia a sua experiência no novo fluxo de emissão?',
        ),
      ).toBeInTheDocument();
    });
    const rating = getByTestId('csat-score-4');
    fireEvent.click(rating);
    const textarea = await findByPlaceholderText(
      'Como foi sua experiência no novo fluxo?',
    );
    if (textarea) {
      fireEvent.change(textarea, { target: { value: 'Bom' } });
      fireEvent.blur(textarea);
    }
    const button = await findByText('Enviar');
    fireEvent.click(button);
    expect(SurveysApi.answerSurvey).toHaveBeenCalledWith(
      SurveyTypeEnum.CSAT,
      'invite',
      'Teste corretor',
      4,
      'Bom',
    );
  });
});
