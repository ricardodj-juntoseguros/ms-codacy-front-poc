import { ProposalListDTO } from '../application/types/dto';
import { ProposalStatusEnum } from '../application/types/model';

export const proposalListMock = {
  currentPage: 1,
  totalCount: 3,
  hasMore: false,
  data: [
    {
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
        companyName: 'TESTE SEGURADO 1',
        federalId: '63698571000161',
      },
      product: {
        modalityId: 97,
        modality: '-- Executante Prestador de Serviços -- 477',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 201,
        companyName: 'TESTE TOMADOR 1',
        federalId: '58461689000131',
      },
    },
    {
      identification: {
        quotationid: 123128,
        policyid: 213812,
        newquoterid: 319731,
        proposalId: 39127831,
      },
      status: ProposalStatusEnum.ANALYSIS,
      insured: {
        id: 102,
        companyName: 'TESTE SEGURADO 2',
        federalId: '46156029000168',
      },
      product: {
        modalityId: 97,
        modality: '-- Executante Prestador de Serviços -- 477',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 202,
        companyName: 'TESTE TOMADOR 2',
        federalId: '88539872000173',
      },
    },
    {
      identification: {
        quotationid: 2136512,
        policyid: 2391209,
        newquoterid: 2138912,
        proposalId: 439483,
      },
      status: ProposalStatusEnum.AWAITING_APPROVAL,
      insured: {
        id: 101,
        companyName: 'TESTE SEGURADO 1',
        federalId: '63698571000161',
      },
      product: {
        modalityId: 98,
        modality: '-- Executante Fornecedor -- 477',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 203,
        companyName: 'TESTE TOMADOR 3',
        federalId: '25897474000109',
      },
    },
  ],
} as ProposalListDTO;

export const proposalListFullPageMock = {
  currentPage: 1,
  totalCount: 20,
  hasMore: false,
  data: [
    {
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
        companyName: 'TESTE SEGURADO 1',
        federalId: '63698571000161',
      },
      product: {
        modalityId: 97,
        modality: 'Executante Prestador de Serviços',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 201,
        companyName: 'TESTE TOMADOR 1',
        federalId: '58461689000131',
      },
    },
    {
      identification: {
        quotationid: 123128,
        policyid: 213812,
        newquoterid: 319731,
        proposalId: 39127831,
      },
      status: ProposalStatusEnum.ANALYSIS,
      insured: {
        id: 102,
        companyName: 'TESTE SEGURADO 2',
        federalId: '46156029000168',
      },
      product: {
        modalityId: 97,
        modality: 'Executante Prestador de Serviços',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 202,
        companyName: 'TESTE TOMADOR 2',
        federalId: '88539872000173',
      },
    },
    {
      identification: {
        quotationid: 2136512,
        policyid: 2391209,
        newquoterid: 2138912,
        proposalId: 439483,
      },
      status: ProposalStatusEnum.AWAITING_APPROVAL,
      insured: {
        id: 101,
        companyName: 'TESTE SEGURADO 1',
        federalId: '63698571000161',
      },
      product: {
        modalityId: 98,
        modality: 'Executante Fornecedor',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 203,
        companyName: 'TESTE TOMADOR 3',
        federalId: '25897474000109',
      },
    },
    {
      identification: {
        quotationid: 223413,
        policyid: 8443712,
        newquoterid: 3372842,
        proposalId: 4432671,
        policyNumber: '02-9443-021472',
      },
      status: ProposalStatusEnum.CANCELLED,
      insured: {
        id: 103,
        companyName: 'TESTE SEGURADO 3',
        federalId: '09235440000100',
      },
      product: {
        modalityId: 98,
        modality: 'Executante Fornecedor',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 203,
        companyName: 'TESTE TOMADOR 3',
        federalId: '25897474000109',
      },
    },
    {
      identification: {
        quotationid: 4983672,
        policyid: 326123,
        newquoterid: 3467123,
        proposalId: 43412365,
        policyNumber: '01-3321-223231',
      },
      status: ProposalStatusEnum.TO_EXPIRE,
      insured: {
        id: 102,
        companyName: 'TESTE SEGURADO 2',
        federalId: '46156029000168',
      },
      product: {
        modalityId: 96,
        modality: 'Executante Construtor',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 203,
        companyName: 'TESTE TOMADOR 3',
        federalId: '25897474000109',
      },
    },
    {
      identification: {
        quotationid: 784256,
        policyid: 384621,
        newquoterid: 4427613,
        proposalId: 4874672,
        policyNumber: '02-9443-021472',
      },
      status: ProposalStatusEnum.ISSUED,
      insured: {
        id: 101,
        companyName: 'TESTE SEGURADO 1',
        federalId: '63698571000161',
      },
      product: {
        modalityId: 96,
        modality: 'Executante Construtor',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 203,
        companyName: 'TESTE TOMADOR 3',
        federalId: '25897474000109',
      },
    },
    {
      identification: {
        quotationid: 4723123,
        policyid: 473254,
        newquoterid: 7543328,
        proposalId: 3338723,
      },
      status: ProposalStatusEnum.REFUSED,
      insured: {
        id: 101,
        companyName: 'TESTE SEGURADO 1',
        federalId: '63698571000161',
      },
      product: {
        modalityId: 97,
        modality: 'Executante Prestador de Serviços',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 201,
        companyName: 'TESTE TOMADOR 1',
        federalId: '58461689000131',
      },
    },
    {
      identification: {
        quotationid: 331236,
        policyid: 4545832,
        newquoterid: 4545498,
        proposalId: 3126322,
      },
      status: ProposalStatusEnum.AWAITING_APPROVAL,
      insured: {
        id: 101,
        companyName: 'TESTE SEGURADO 2',
        federalId: '46156029000168',
      },
      product: {
        modalityId: 97,
        modality: 'Executante Prestador de Serviços',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 201,
        companyName: 'TESTE TOMADOR 2',
        federalId: '88539872000173',
      },
    },
    {
      identification: {
        quotationid: 331236,
        policyid: 4545832,
        newquoterid: 4545498,
        proposalId: 3137632,
      },
      status: ProposalStatusEnum.EXPIRED,
      insured: {
        id: 103,
        companyName: 'TESTE SEGURADO 3',
        federalId: '09235440000100',
      },
      product: {
        modalityId: 73,
        modality: 'Adiantamento de Pagamento',
        subModalityId: 1,
        subModality: 'Convencional',
      },
      policyholder: {
        id: 203,
        companyName: 'TESTE TOMADOR 3',
        federalId: '25897474000109',
      },
    },
    {
      identification: {
        quotationid: 331236,
        policyid: 4545832,
        newquoterid: 4545498,
        proposalId: 1237632,
        policyNumber: '01-2023-2399483',
      },
      status: ProposalStatusEnum.ISSUED,
      insured: {
        id: 103,
        companyName: 'TESTE SEGURADO 3',
        federalId: '09235440000100',
      },
      product: {
        modalityId: 98,
        modality: 'Executante Fornecedor',
        subModalityId: 90,
        subModality: '_Convencional - 662 (Com Salvamento)',
      },
      policyholder: {
        id: 201,
        companyName: 'TESTE TOMADOR 1',
        federalId: '58461689000131',
      },
    },
  ],
} as ProposalListDTO;
