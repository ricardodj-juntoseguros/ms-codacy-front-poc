import { useDispatch } from 'react-redux';
import { Button, Modal } from 'junto-design-system';
import { AlertIllustration } from '@shared/ui';
import { opportunitiesDetailsActions } from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';

interface OpportunitySelectionLossModalProps {
  isOpen: boolean;
  variant?: 'discard-first' | 'keep-first';
  onModalClose: () => void;
  onDiscardSelection: () => void;
}

const OpportunitySelectionLossModal: React.FC<OpportunitySelectionLossModalProps> =
  ({ isOpen, onModalClose, onDiscardSelection, variant = 'keep-first' }) => {
    const dispatch = useDispatch();

    const handleDiscardSelection = () => {
      dispatch(opportunitiesDetailsActions.clearOpportunitySelection());
      onDiscardSelection();
    };

    const getModalTitle = () => {
      return variant === 'keep-first'
        ? 'A sua seleção de oportunidades será perdida'
        : 'Tem certeza que deseja descartar sua seleção?';
    };

    const getModalButtons = () => {
      const primaryTestId =
        variant === 'keep-first'
          ? 'btn-keep-selection'
          : 'btn-discard-selection';
      const secondaryTestId =
        variant === 'keep-first'
          ? 'btn-discard-selection'
          : 'btn-keep-selection';
      const primaryText =
        variant === 'keep-first' ? 'Manter seleção' : 'Continuar e descartar';
      const secondaryText =
        variant === 'keep-first' ? 'Continuar e descartar' : 'Manter seleção';
      const primaryAction =
        variant === 'keep-first'
          ? () => onModalClose()
          : () => handleDiscardSelection();
      const secondaryAction =
        variant === 'keep-first'
          ? () => handleDiscardSelection()
          : () => onModalClose();

      return {
        primary: (
          <Button data-testid={primaryTestId} onClick={primaryAction}>
            {primaryText}
          </Button>
        ),
        secondary: (
          <Button
            data-testid={secondaryTestId}
            variant="secondary"
            onClick={secondaryAction}
          >
            {secondaryText}
          </Button>
        ),
      };
    };

    return (
      <Modal
        open={isOpen}
        onClose={() => onModalClose()}
        onBackdropClick={() => onModalClose()}
        size="default"
        template={{
          icon: <AlertIllustration />,
          title: {
            value: getModalTitle(),
            align: 'center',
          },
          text: {
            value:
              'Você ainda não solicitou detalhes da(s) oportunidade(s) selecionada(s), ao realizar essa ação você perderá a sua seleção.',
            align: 'center',
          },
          buttons: getModalButtons(),
        }}
      />
    );
  };

export default OpportunitySelectionLossModal;
