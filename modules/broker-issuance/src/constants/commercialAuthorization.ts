import { CommercialAuthorizationTypeEnum } from '../application/types/model';
import { ReactComponent as HappyPaper } from '../presentation/components/CommercialAuthorizationModal/assets/happy-paper.svg';
import { ReactComponent as PaperPlane } from '../presentation/components/CommercialAuthorizationModal/assets/paper-plane.svg';

export const COMMERCIAL_AUTHORIZATION_MODAL_DATA = {
  [CommercialAuthorizationTypeEnum.hasAuthorization]: {
    icon: HappyPaper,
    title: 'Essa proposta está pronta para ser emitida.',
    description: 'Tem certeza que está tudo certo para realizar a emissão?',
    buttonsLabels: {
      primary: 'Tudo certo, pode emitir',
      secondary: 'Voltar para revisar',
    },
  },
  [CommercialAuthorizationTypeEnum.sendToApproval]: {
    icon: PaperPlane,
    title: 'Essa proposta será enviada para aprovação do corretor.',
    description:
      'Após aprovação, a apólice será emitida. Tem certeza que está tudo certo para o envio?',
    buttonsLabels: {
      primary: 'Sim, enviar para aprovação',
      secondary: 'Voltar para revisar',
    },
  },
}
