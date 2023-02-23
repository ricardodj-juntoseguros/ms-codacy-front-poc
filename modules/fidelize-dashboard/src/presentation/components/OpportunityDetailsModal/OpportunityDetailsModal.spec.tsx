import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import {
  ModalityEnum,
  OpportunityDetailsCategoryEnum,
  OpportunityDetailsTypeEnum,
  OpportunityRelevanceEnum,
} from '../../../application/types/model';
import OpportunitiesDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import { opportunitiesDetailsActions } from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import OpportunityDetailsModal from './OpportunityDetailsModal';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import { store } from '../../../config/store';

describe('OpportunityDetailsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render the confirmation step correctly when opportunity prop is passed', async () => {
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: OpportunityDetailsCategoryEnum.RENEWAL,
      type: OpportunityDetailsTypeEnum.FISCAL,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2024-02-02T03:00:00.000Z',
      mappingDate: '2021-01-01T03:00:00.000Z',
      securityAmount: 2550650.5,
      expired: false,
      observation: 'Com vencimento em 22/02/2024',
      economicGroup: 'Teste grupo',
      lastSolicitationDate: null,
    };
    jest
      .spyOn(
        OpportunitiesDetailsApi,
        'getOpportunityCompleteDetailsByModalityAndId',
      )
      .mockImplementationOnce(async () => {
        return { hasLimit: true };
      });
    const { container, getByText, findByText } = render(
      <Provider store={store}>
        <OpportunityDetailsModal
          onModalClose={jest.fn()}
          modality={ModalityEnum.FISCAL}
          opportunity={opportunityMock}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Solicitar detalhes')).toBeInTheDocument();
    expect(getByText('Quero mais detalhes!')).toBeInTheDocument();
    expect(
      getByText(
        'Confirme os dados da oportunidade que você deseja obter mais detalhes, que em breve te retornaremos com as informações adicionais (como número de CNJ, entre outras).',
      ),
    ).toBeInTheDocument();
    expect(getByText('Oportunidade fiscal selecionada:')).toBeInTheDocument();
  });

  it('Should render the confirmation step correctly without opportunity prop when there is only one opportunity selected', async () => {
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: OpportunityDetailsCategoryEnum.RENEWAL,
      type: OpportunityDetailsTypeEnum.LABOR,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2024-02-02T03:00:00.000Z',
      mappingDate: '2021-01-01T03:00:00.000Z',
      securityAmount: 2550650.5,
      expired: false,
      observation: 'Com vencimento em 22/02/2024',
      economicGroup: 'Teste grupo',
      lastSolicitationDate: null,
    };
    jest
      .spyOn(
        OpportunitiesDetailsApi,
        'getOpportunityCompleteDetailsByModalityAndId',
      )
      .mockImplementationOnce(async () => {
        return { hasLimit: true };
      });
    store.dispatch(
      opportunitiesDetailsActions.addOpportunityToSelection(opportunityMock),
    );
    const { container, getByText, findByText } = render(
      <Provider store={store}>
        <OpportunityDetailsModal
          onModalClose={jest.fn()}
          modality={ModalityEnum.LABOR}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(await findByText('Solicitar detalhes')).toBeInTheDocument();
    expect(getByText('Quero mais detalhes!')).toBeInTheDocument();
    expect(
      getByText(
        'Confirme os dados da oportunidade que você deseja obter mais detalhes, que em breve te retornaremos com as informações adicionais (como número de CNJ, entre outras).',
      ),
    ).toBeInTheDocument();
    expect(
      getByText('Oportunidade trabalhista selecionada:'),
    ).toBeInTheDocument();
  });

  it('Should show email step and call correct api method on submit', async () => {
    jest
      .spyOn(OpportunitiesDetailsApi, 'sendMoreDetailsFromOpportunityList')
      .mockImplementationOnce(async () => {
        return { success: true };
      });
    jest
      .spyOn(
        OpportunitiesDetailsApi,
        'getOpportunityCompleteDetailsByModalityAndId',
      )
      .mockImplementationOnce(async () => {
        return { hasLimit: true };
      });
    const onCloseMock = jest.fn();
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: OpportunityDetailsCategoryEnum.RENEWAL,
      type: OpportunityDetailsTypeEnum.LABOR,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2024-02-02T03:00:00.000Z',
      observation: 'Com vencimento em 22/02/2024',
      mappingDate: '2021-01-01T03:00:00.000Z',
      securityAmount: 2550650.5,
      expired: false,
      economicGroup: 'Teste grupo',
      lastSolicitationDate: null,
    };
    const { getByTestId, findByText, queryByText, findByTestId } = render(
      <Provider store={store}>
        <OpportunityDetailsModal
          onModalClose={onCloseMock}
          modality={ModalityEnum.LABOR}
          opportunity={opportunityMock}
        />
      </Provider>,
    );

    const submitBtn = await findByTestId('submit-more-details');
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    const mailInput = getByTestId('mail-input-more-details');
    const mailSubmitBtn = getByTestId('submit-more-details-email');

    fireEvent.change(mailInput, {
      target: { value: 'teste@juntoseguros.com' },
    });
    fireEvent.click(mailSubmitBtn);

    expect(await findByText('Agora é só aguardar')).toBeInTheDocument();
    const closeModalBtn = getByTestId('modal-close-button');
    await act(async () => {
      fireEvent.click(closeModalBtn);
    });
    expect(
      OpportunitiesDetailsApi.sendMoreDetailsFromOpportunityList,
    ).toHaveBeenCalledTimes(1);
    expect(queryByText('Agora é só aguardar')).not.toBeInTheDocument();
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('Should render error message if api method on submit fails', async () => {
    jest
      .spyOn(OpportunitiesDetailsApi, 'sendMoreOpportunityDetailsMail')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => {
          reject();
        });
      });
    jest
      .spyOn(
        OpportunitiesDetailsApi,
        'getOpportunityCompleteDetailsByModalityAndId',
      )
      .mockImplementationOnce(async () => {
        return { hasLimit: true };
      });
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: OpportunityDetailsCategoryEnum.RENEWAL,
      type: OpportunityDetailsTypeEnum.FISCAL,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2024-02-02T03:00:00.000Z',
      observation: 'Com vencimento em 22/02/2024',
      mappingDate: '2021-01-01T03:00:00.000Z',
      securityAmount: 2550650.5,
      expired: false,
      economicGroup: 'Teste grupo',
      lastSolicitationDate: null,
    };
    const { getByTestId, findByTestId, queryByText, findByText } = render(
      <Provider store={store}>
        <OpportunityDetailsModal
          onModalClose={jest.fn()}
          modality={ModalityEnum.FISCAL}
          opportunity={opportunityMock}
        />
      </Provider>,
    );

    const submitBtn = await findByTestId('submit-more-details');
    await act(async () => {
      fireEvent.click(submitBtn);
    });
    const mailInput = getByTestId('mail-input-more-details');
    const mailSubmitBtn = getByTestId('submit-more-details-email');

    fireEvent.change(mailInput, {
      target: { value: 'teste@juntoseguros.com' },
    });
    fireEvent.click(mailSubmitBtn);
    expect(
      await findByText(
        'Ocorreu um erro inesperado ao realizar a sua solicitação. Por favor, tente novamente.',
      ),
    ).toBeInTheDocument();
    expect(queryByText('Agora é só aguardar')).not.toBeInTheDocument();
  });

  it('Should render message if there is one opportunity and was already solicited', async () => {
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: OpportunityDetailsCategoryEnum.RENEWAL,
      type: OpportunityDetailsTypeEnum.FISCAL,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2024-02-02T03:00:00.000Z',
      observation: 'Com vencimento em 22/02/2024',
      mappingDate: '2021-01-01T03:00:00.000Z',
      securityAmount: 2550650.5,
      expired: false,
      economicGroup: 'Teste grupo',
      lastSolicitationDate: '2022-12-20T03:00:00.000Z',
    };
    jest
      .spyOn(
        OpportunitiesDetailsApi,
        'getOpportunityCompleteDetailsByModalityAndId',
      )
      .mockImplementationOnce(async () => {
        return { hasLimit: true };
      });
    const { findByText } = render(
      <Provider store={store}>
        <OpportunityDetailsModal
          onModalClose={jest.fn()}
          modality={ModalityEnum.FISCAL}
          opportunity={opportunityMock}
        />
      </Provider>,
    );
    expect(
      await findByText(
        'Sua corretora já solicitou detalhes desta oportunidade em 20/12/22. Ainda assim, você pode solicitar novamente.',
      ),
    ).toBeInTheDocument();
  });
});
