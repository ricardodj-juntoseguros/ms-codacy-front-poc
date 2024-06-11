import { ProposalFinishEnum } from '../application/types/model';
import { ReactComponent as AnalisysIcon } from '../presentation/pages/ProposalFinishContainer/assets/analysis.svg';
import { ReactComponent as SuccessIcon } from '../presentation/pages/ProposalFinishContainer/assets/success.svg';

export const PROPOSAL_FINISH_DATA = {
  [ProposalFinishEnum.success]: {
    icon: SuccessIcon,
    title: 'Sua apólice foi emitida!',
    description:
      'Em alguns instantes você receberá via email sua apólice de seguro e o boleto para pagamento.',
    primaryButton: 'Ir para lista de processos',
    secondaryButton: null,
  },
  [ProposalFinishEnum.analysis]: {
    icon: AnalisysIcon,
    title: 'Sua solicitação está em análise',
    description:
      'Em breve você receberá o retorno da nossa equipe. Clique abaixo para ver os detalhes e o status da proposta.',
    primaryButton: 'Acompanhar solicitação',
    secondaryButton: 'Ir para lista de processos',
  },
  [ProposalFinishEnum.sendToApproval]: {
    icon: AnalisysIcon,
    title: 'Sua proposta foi enviada para aprovação do corretor',
    description:
      'Após a aprovação, você receberá via e-mail a apólice de seguro e boleto para pagamento.',
    primaryButton: 'Ir para lista de processos',
    secondaryButton: null,
  },
};
