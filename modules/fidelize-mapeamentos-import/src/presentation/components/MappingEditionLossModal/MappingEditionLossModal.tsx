import { Button, Modal } from 'junto-design-system';
import { AlertIllustration } from '@shared/ui';
import { useSelector } from 'react-redux';
import { selectModalEdition } from '../../../application/features/modalMapping/ModalMappingSlice';

interface MappingEditionLossModalProps {
  isOpen: boolean;
  variant?: 'discard-first' | 'keep-first';
  onModalClose: () => void;
  onDiscardSelection: () => void;
}

const MappingEditionLossModal: React.FC<MappingEditionLossModalProps> = ({
  isOpen,
  onModalClose,
  onDiscardSelection,
  variant = 'keep-first',
}) => {
  const { scrollingTo } = useSelector(selectModalEdition);
  const handleDiscardSelection = () => {
    onDiscardSelection();
  };

  const getModalTitle = () => {
    return 'A edição de uma solicitação será perdida';
  };

  const getModalButtons = () => {
    const primaryTestId =
      variant === 'keep-first' ? 'btn-keep-selection' : 'btn-discard-selection';
    const secondaryTestId =
      variant === 'keep-first' ? 'btn-discard-selection' : 'btn-keep-selection';
    const primaryText = 'Ver edição';
    const secondaryText = 'Continuar e descartar';
    const primaryAction =
      variant === 'keep-first'
        ? () => handleDiscardSelection()
        : () => {
            window.scrollTo(0, scrollingTo);
            onModalClose();
          };
    const secondaryAction =
      variant === 'keep-first'
        ? () => {
            window.scrollTo(0, scrollingTo);
            onModalClose();
          }
        : () => {
            handleDiscardSelection();
          };

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
      onClose={() => {
        window.scrollTo(0, scrollingTo);
        onModalClose();
      }}
      onBackdropClick={() => {
        window.scrollTo(0, scrollingTo);
        onModalClose();
      }}
      size="default"
      template={{
        icon: <AlertIllustration />,
        title: {
          value: getModalTitle(),
          align: 'center',
        },
        text: {
          value:
            'Você ainda não salvou as alterações que fez em uma solicitação, ao realizar essa ação você perderá a sua edição.',
          align: 'center',
        },
        buttons: getModalButtons(),
      }}
    />
  );
};

export default MappingEditionLossModal;
