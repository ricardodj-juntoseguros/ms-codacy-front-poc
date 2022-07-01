import { Provider } from 'react-redux';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import {
  ModalityEnum,
  OpportunityDetailsTypeEnum,
  OpportunityRelevanceEnum,
} from '../../../application/types/model';
import OpportunityDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import { opportunitiesDetailsActions } from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import OpportunityDetailsModal from './OpportunityDetailsModal';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import { store } from '../../../config/store';

describe('OpportunityDetailsModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should render the confirmation step correctly when opportunity prop is passed', () => {
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: 'Renovação',
      type: OpportunityDetailsTypeEnum.FISCAL,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2024-02-02T03:00:00.000Z',
      mappingDate: '01/jan/2021',
      securityAmount: 2550650.5,
      expired: false,
      observation: 'Com vencimento em 22/02/2024',
    };
    const { container, getByText } = render(
      <Provider store={store}>
        <OpportunityDetailsModal
          isOpen
          onModalClose={jest.fn()}
          modality={ModalityEnum.FISCAL}
          opportunity={opportunityMock}
        />
      </Provider>,
    );
    expect(container).toBeInTheDocument();
    expect(getByText('Quero mais detalhes!')).toBeInTheDocument();
    expect(
      getByText(
        'Confirme os dados da oportunidade que você deseja obter mais detalhes, que em breve te retornaremos com as informações adicionais (como número de CNJ, entre outras).',
      ),
    ).toBeInTheDocument();
    expect(getByText('Oportunidade fiscal selecionada:')).toBeInTheDocument();
  });

  it('Should render the confirmation step correctly without opportunity prop when there is only one opportunity selected', () => {
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: 'Renovação',
      type: OpportunityDetailsTypeEnum.LABOR,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2024-02-02T03:00:00.000Z',
      mappingDate: '01/jan/2021',
      securityAmount: 2550650.5,
      expired: false,
      observation: 'Com vencimento em 22/02/2024',
    };
    const { container, getByText } = render(
      <Provider store={store}>
        <OpportunityDetailsModal
          isOpen
          onModalClose={jest.fn()}
          modality={ModalityEnum.TRABALHISTA}
        />
      </Provider>,
    );
    store.dispatch(
      opportunitiesDetailsActions.addOpportunityToSelection(opportunityMock),
    );
    expect(container).toBeInTheDocument();
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

  it('Should call correct api method on submit button click if opportunity modality is FISCAL', async () => {
    jest
      .spyOn(OpportunityDetailsApi, 'sendMoreOpportunityDetailsMail')
      .mockImplementationOnce(async () => {
        return { success: true };
      });
    const onCloseMock = jest.fn();
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: 'Renovação',
      type: OpportunityDetailsTypeEnum.FISCAL,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2024-02-02T03:00:00.000Z',
      observation: 'Com vencimento em 22/02/2024',
      mappingDate: '01/jan/2021',
      securityAmount: 2550650.5,
      expired: false,
    };
    const { getByTestId, getByText, queryByText } = render(
      <Provider store={store}>
        <OpportunityDetailsModal
          isOpen
          onModalClose={onCloseMock}
          modality={ModalityEnum.FISCAL}
          opportunity={opportunityMock}
        />
      </Provider>,
    );

    const submitBtn = getByTestId('submit-more-details');
    await act(async () => {
      fireEvent.click(submitBtn);
    });
    expect(getByText('Agora é só aguardar')).toBeInTheDocument();
    const closeModalBtn = getByTestId('modal-close-button');
    await act(async () => {
      fireEvent.click(closeModalBtn);
    });
    expect(
      OpportunityDetailsApi.sendMoreOpportunityDetailsMail,
    ).toHaveBeenCalledTimes(1);
    expect(queryByText('Agora é só aguardar')).not.toBeInTheDocument();
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('Should show email step and call correct api method on submit if opportunity modality is LABOR', async () => {
    jest
      .spyOn(OpportunityDetailsApi, 'sendMoreDetailsFromOpportunityList')
      .mockImplementationOnce(async () => {
        return { success: true };
      });
    const onCloseMock = jest.fn();
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: 'Renovação',
      type: OpportunityDetailsTypeEnum.LABOR,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2024-02-02T03:00:00.000Z',
      observation: 'Com vencimento em 22/02/2024',
      mappingDate: '01/jan/2021',
      securityAmount: 2550650.5,
      expired: false,
    };
    const { getByTestId, findByText, queryByText } = render(
      <Provider store={store}>
        <OpportunityDetailsModal
          isOpen
          onModalClose={onCloseMock}
          modality={ModalityEnum.TRABALHISTA}
          opportunity={opportunityMock}
        />
      </Provider>,
    );

    const submitBtn = getByTestId('submit-more-details');
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
      OpportunityDetailsApi.sendMoreDetailsFromOpportunityList,
    ).toHaveBeenCalledTimes(1);
    expect(queryByText('Agora é só aguardar')).not.toBeInTheDocument();
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('Should render error message if api method on submit fails', async () => {
    jest
      .spyOn(OpportunityDetailsApi, 'sendMoreOpportunityDetailsMail')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => {
          reject();
        });
      });
    const opportunityMock: OpportunityDetailsItemDTO = {
      category: 'Renovação',
      type: OpportunityDetailsTypeEnum.FISCAL,
      id: 'id',
      policyholder: 'Teste tomador',
      relevance: OpportunityRelevanceEnum.HIGH,
      expiration: '2024-02-02T03:00:00.000Z',
      observation: 'Com vencimento em 22/02/2024',
      mappingDate: '01/jan/2021',
      securityAmount: 2550650.5,
      expired: false,
    };
    const { getByTestId, getByText, queryByText } = render(
      <Provider store={store}>
        <OpportunityDetailsModal
          isOpen
          onModalClose={jest.fn()}
          modality={ModalityEnum.FISCAL}
          opportunity={opportunityMock}
        />
      </Provider>,
    );

    const submitBtn = getByTestId('submit-more-details');
    await act(async () => {
      fireEvent.click(submitBtn);
    });
    expect(
      getByText(
        'Ocorreu um erro inesperado ao realizar a sua solicitação. Por favor, tente novamente.',
      ),
    ).toBeInTheDocument();
    expect(queryByText('Agora é só aguardar')).not.toBeInTheDocument();
  });
});
