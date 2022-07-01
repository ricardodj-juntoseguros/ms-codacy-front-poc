import { useDispatch } from 'react-redux';
import { Button, Modal } from 'junto-design-system';
import { opportunitiesDetailsActions } from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';

interface OpportunitySelectionLossModalProps {
  isOpen: boolean;
  onModalClose: () => void;
  onDiscardSelection: () => void;
}

const OpportunitySelectionLossModal: React.FC<OpportunitySelectionLossModalProps> =
  ({ isOpen, onModalClose, onDiscardSelection }) => {
    const dispatch = useDispatch();

    const handleDiscardSelection = () => {
      dispatch(opportunitiesDetailsActions.clearOpportunitySelection());
      onDiscardSelection();
    };

    return (
      <Modal
        open={isOpen}
        onClose={() => onModalClose()}
        onBackdropClick={() => onModalClose()}
        size="default"
        template={{
          title: {
            value: 'A sua seleção de oportunidades será perdida',
            align: 'center',
          },
          text: {
            value:
              'Você ainda não solicitou detalhes da(s) oportunidade(s) selecionada(s), ao realizar essa ação você perderá a sua seleção.',
            align: 'center',
          },
          buttons: {
            primary: (
              <Button
                data-testid="btn-keep-selection"
                onClick={() => onModalClose()}
              >
                Manter seleção
              </Button>
            ),
            secondary: (
              <Button
                data-testid="btn-discard-selection"
                variant="secondary"
                onClick={() => handleDiscardSelection()}
              >
                Continuar e descartar
              </Button>
            ),
          },
        }}
      />
    );
  };

export default OpportunitySelectionLossModal;
