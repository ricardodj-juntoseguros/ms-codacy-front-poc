import { fireEvent, render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import {
  ModalityEnum,
  OpportunityDetailsTypeEnum,
  OpportunityRelevanceEnum,
} from '../../../application/types/model';
import OpportunityDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import MoreOpportunityDetailsModal from './MoreOpportunityDetailsModal';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';

describe('MoreOpportunityDetailsModal', () => {
  it('Should render sucessfully with given props', () => {
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
    const { container } = render(
      <MoreOpportunityDetailsModal
        modality={ModalityEnum.FISCAL}
        opportunity={opportunityMock}
      />,
    );
    expect(container).toBeInTheDocument();
  });

  it('Should call api on submit button click', async () => {
    jest
      .spyOn(OpportunityDetailsApi, 'sendMoreOpportunityDetailsMail')
      .mockImplementationOnce(async () => {
        return { success: true };
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
      <MoreOpportunityDetailsModal
        modality={ModalityEnum.FISCAL}
        opportunity={opportunityMock}
      />,
    );

    const triggerBtn = getByTestId('modal-trigger');

    await act(async () => {
      fireEvent.click(triggerBtn);
    });

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
  });
});
