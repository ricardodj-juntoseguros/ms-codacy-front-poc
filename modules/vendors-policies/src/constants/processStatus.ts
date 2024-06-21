import { ProposalStatusEnum } from '../application/types/model';

export const PROCESS_STATUS = [
  {
    id: ProposalStatusEnum.DEFAULT,
    name: 'default',
    detailsMessage: 'Essa proposta está em processamento.',
    detailsMessagePolicyholder: 'Essa proposta está em processamento.',
    detailsIcon: 'settings',
    cardTagLabel: 'Em processamento',
  },
  {
    id: ProposalStatusEnum.ANALYSIS,
    name: 'under-analysis',
    detailsMessage: 'Essa solicitação está em análise da seguradora.',
    detailsMessagePolicyholder:
      'Essa solicitação está em análise da seguradora.',
    detailsIcon: 'alert-triangle',
    cardTagLabel: 'Em análise',
  },
  {
    id: ProposalStatusEnum.AWAITING_APPROVAL,
    name: 'awaiting-approval',
    detailsMessage: 'Essa solicitação está aguardando aprovação do fornecedor.',
    detailsMessagePolicyholder:
      'Essa solicitação está aguardando sua aprovação. Verifique seu e-mail.',
    detailsIcon: 'alert-circle',
    cardTagLabel: 'Aguardando aprovação',
  },
  {
    id: ProposalStatusEnum.ISSUED,
    name: 'issued',
    detailsMessage: 'Essa apólice está vigente.',
    detailsMessagePolicyholder: 'Essa apólice está vigente.',
    detailsIcon: 'check-circle',
    cardTagLabel: 'Vigente',
  },
  {
    id: ProposalStatusEnum.TO_EXPIRE,
    name: 'to-expire',
    detailsMessage: 'Essa apólice vai vencer em breve.',
    detailsMessagePolicyholder: 'Essa apólice vai vencer em breve.',
    detailsIcon: 'check-circle',
    cardTagLabel: 'A vencer',
  },
  {
    id: ProposalStatusEnum.EXPIRED,
    name: 'expired',
    detailsMessage: 'Essa apólice está vencida.',
    detailsMessagePolicyholder: 'Essa apólice está vencida.',
    detailsIcon: 'alert-triangle',
    cardTagLabel: 'Vencida',
  },
  {
    id: ProposalStatusEnum.REFUSED,
    name: 'refused',
    detailsMessage: 'Essa solicitação foi recusada.',
    detailsMessagePolicyholder: 'Essa solicitação foi recusada.',
    detailsIcon: 'alert-triangle',
    cardTagLabel: 'Recusada',
  },
  {
    id: ProposalStatusEnum.CANCELLED,
    name: 'canceled',
    detailsMessage: 'Essa apólice foi cancelada.',
    detailsMessagePolicyholder: 'Essa apólice foi cancelada.',
    detailsIcon: 'alert-triangle',
    cardTagLabel: 'Cancelada',
  },
];
