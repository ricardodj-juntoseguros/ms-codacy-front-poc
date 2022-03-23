import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ModalityEnum,
  OpportunityRelevanceEnum,
} from '../../../application/types/model';
import MoreOpportunityDetailsModal from './MoreOpportunityDetailsModal';

describe('MoreOpportunityDetailsModal', () => {
  it('Should render sucessfully with given props', () => {
    const { container } = render(
      <MoreOpportunityDetailsModal
        modality={ModalityEnum.FISCAL}
        policyholder="Teste tomador"
        type="Renovação"
        securityAmount={1252000}
        expiration="Com vencimento em 22/fev/2024"
        mappingDate="01/jan/2021"
        relevance={OpportunityRelevanceEnum.HIGH}
      />,
    );
    expect(container).toBeInTheDocument();
  });
});
