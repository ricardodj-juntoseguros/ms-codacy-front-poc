import { ChatUtils } from '@shared/utils';

export const QUOTE_ERROR_FEEDBACKS = [
  {
    keyMessage: 'Taxa do tomador não encontrada.',
    text: 'Ops! Parece que tivemos um problema com a configuração da taxa do Tomador. Por favor, %ACTION_BUTTON% para ajuste.',
    actionButtonText: 'entre em contato conosco via chat',
    onActionButtonClick: () => ChatUtils.zenDesk.open(),
  },
];
