/* eslint-disable import/first */
/* eslint-disable import/order */
import '@testing-library/jest-dom';
import { ProposalStatusEnum } from '../../../application/types/model';
import { ProposalDTO } from '../../../application/types/dto';
import { fireEvent, render } from '../../../config/testUtils';
import DocumentAPI from '../../../application/features/document/DocumentAPI';
import ProcessListCard from './ProcessListCard';

const mockHistoryPush = jest.fn();
jest.mock('@shared/utils', () => {
  const original = jest.requireActual('@shared/utils');
  return {
    ...original,
    downloadFile: jest.fn(),
  };
});
jest.mock('react-router', () => {
  const rest = jest.requireActual('react-router');

  return {
    ...rest,
    useNavigate: () => mockHistoryPush,
  };
});

import { downloadFile } from '@shared/utils';

describe('ProcessListCard', () => {
  it('Should render proposal data correctly for issued proposals', () => {
    const mockProposal: ProposalDTO = {
      identification: {
        quotationid: 111222,
        policyid: 3812731,
        newquoterid: 112331,
        proposalId: 3399123,
        policyNumber: '01-0775-0291402',
      },
      status: ProposalStatusEnum.ISSUED,
      insured: {
        id: 101,
        companyName: 'BANCO JUNTO SEGUROS',
        federalId: '63698571000161',
      },
      product: {
        modalityId: 97,
        modality: 'Executante prestador de serviços',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 201,
        companyName: 'CONSTRUTORA JUNTO SEGUROS',
        federalId: '58461689000131',
      },
    };

    const { getByText } = render(<ProcessListCard proposal={mockProposal} />);

    expect(getByText('Vigente')).toBeInTheDocument();
    expect(getByText('BANCO JUNTO SEGUROS')).toBeInTheDocument();
    expect(getByText('CONSTRUTORA JUNTO SEGUROS')).toBeInTheDocument();
    expect(getByText('01-0775-0291402')).toBeInTheDocument();
    expect(getByText('Executante prestador de serviços')).toBeInTheDocument();
  });

  it('Should render proposal data correctly for not yet issued proposals', () => {
    const mockProposal: ProposalDTO = {
      identification: {
        quotationid: 111222,
        policyid: 3812731,
        newquoterid: 112331,
        proposalId: 3399123,
      },
      status: ProposalStatusEnum.ANALYSIS,
      insured: {
        id: 101,
        companyName: 'BANCO JUNTO SEGUROS',
        federalId: '63698571000161',
      },
      product: {
        modalityId: 97,
        modality: 'Executante prestador de serviços',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 201,
        companyName: 'CONSTRUTORA JUNTO SEGUROS',
        federalId: '58461689000131',
      },
    };

    const { getByText } = render(<ProcessListCard proposal={mockProposal} />);

    expect(getByText('Em análise')).toBeInTheDocument();
    expect(getByText('BANCO JUNTO SEGUROS')).toBeInTheDocument();
    expect(getByText('CONSTRUTORA JUNTO SEGUROS')).toBeInTheDocument();
    expect(getByText('3812731')).toBeInTheDocument();
    expect(getByText('Executante prestador de serviços')).toBeInTheDocument();
  });

  it('Should go to proposal details screen on more details button click', async () => {
    const mockProposal: ProposalDTO = {
      identification: {
        quotationid: 111222,
        policyid: 3812731,
        newquoterid: 112331,
        proposalId: 3399123,
      },
      status: ProposalStatusEnum.ANALYSIS,
      insured: {
        id: 101,
        companyName: 'BANCO JUNTO SEGUROS',
        federalId: '63698571000161',
      },
      product: {
        modalityId: 97,
        modality: 'Executante prestador de serviços',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 201,
        companyName: 'CONSTRUTORA JUNTO SEGUROS',
        federalId: '58461689000131',
      },
    };

    const { getByTestId } = render(<ProcessListCard proposal={mockProposal} />);

    const trigger = getByTestId('processListCard-button-3399123-details');
    fireEvent.click(trigger);
    expect(mockHistoryPush).toHaveBeenCalledWith('/details/3399123');
  });

  it('Should call document api and download policy on donwload policy button click', async () => {
    jest
      .spyOn(DocumentAPI, 'getPolicyDocument')
      .mockImplementation(async () => {
        return {
          linkDocumento: 'teste_link',
        };
      });
    const mockProposal: ProposalDTO = {
      identification: {
        quotationid: 111222,
        policyid: 3812731,
        newquoterid: 112331,
        proposalId: 3399123,
        policyNumber: '02-8938-838121',
      },
      status: ProposalStatusEnum.ISSUED,
      insured: {
        id: 101,
        companyName: 'BANCO JUNTO SEGUROS',
        federalId: '63698571000161',
      },
      product: {
        modalityId: 97,
        modality: 'Executante prestador de serviços',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 201,
        companyName: 'CONSTRUTORA JUNTO SEGUROS',
        federalId: '58461689000131',
      },
    };

    const { getByTestId, findByText } = render(
      <ProcessListCard proposal={mockProposal} />,
    );

    const trigger = getByTestId('processListCard-button-3399123-download');
    fireEvent.click(trigger);
    await findByText('Baixar apólice');
    expect(DocumentAPI.getPolicyDocument).toHaveBeenCalledWith(3812731);
    expect(downloadFile).toHaveBeenCalledWith('teste_link');
  });
});
