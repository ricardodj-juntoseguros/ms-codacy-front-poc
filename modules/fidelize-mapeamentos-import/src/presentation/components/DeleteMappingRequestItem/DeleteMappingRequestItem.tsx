/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef, useState } from 'react';
import { Button, LinkButton, Modal } from 'junto-design-system';
import { AlertIllustration, SuccessIllustration } from '@shared/ui';
import { useDispatch } from 'react-redux';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import { setEditorId } from '../../../application/features/modalMapping/ModalMappingSlice';

interface DeleteMappingRequestItemProps {
  mappingId: number;
  policyholderName: string;
  onChangeCallback: () => void;
}

type ModalFlowStep = 'CONFIRM' | 'SUCCESS' | 'ONERROR';

const DeleteMappingRequestItem: React.FC<DeleteMappingRequestItemProps> = ({
  mappingId,
  policyholderName,
  onChangeCallback,
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState<ModalFlowStep>('CONFIRM');
  const onCloseModal = () => {
    dispatch(setEditorId([0]));
    setIsOpen(false);
    if (currentStep === 'SUCCESS') {
      onChangeCallback();
    }
  };

  const fetchDeleteMappingItem = () => {
    new ListingMappingApi()
      .deleteMappingItem(mappingId)
      .then(() => {
        setCurrentStep('SUCCESS');
      })
      .catch(() => {
        setCurrentStep('ONERROR');
      });
  };

  const getModalTemplate = () => {
    switch (currentStep) {
      case 'CONFIRM':
        return {
          title: {
            value: 'Tem certeza que deseja excluir esta solicitação?',
            align: 'center' as any,
            fontWeight: 'bold' as any,
          },
          text: {
            value: `Esta solicitação do tomador ${policyholderName} será removida da lista.`,
            align: 'center' as any,
          },
          buttons: {
            primary: (
              <Button
                data-testid="confirm-exclusion-btn"
                onClick={() => fetchDeleteMappingItem()}
              >
                Excluir solicitação
              </Button>
            ),
            secondary: (
              <Button
                data-testid="cancel-exclusion-btn"
                onClick={() => onCloseModal()}
                variant="secondary"
              >
                Cancelar
              </Button>
            ),
          },
        };
      case 'ONERROR':
        return {
          title: {
            value: 'Não foi possível excluir a solicitação',
            align: 'center' as any,
            fontWeight: 'bold' as any,
          },
          text: {
            value:
              'No momento o sistema não conseguiu concluir a operação. Tente novamente em instantes.',
            align: 'center' as any,
          },
          buttons: {
            primary: (
              <Button
                data-testid="retry-exclusion-btn"
                onClick={() => fetchDeleteMappingItem()}
              >
                Tentar novamente
              </Button>
            ),
            secondary: (
              <Button
                data-testid="cancel-exclusion-btn"
                onClick={() => onCloseModal()}
                variant="secondary"
              >
                Continuar sem excluir
              </Button>
            ),
          },
          icon: <AlertIllustration />,
        };
      case 'SUCCESS':
        return {
          title: {
            value: 'Solicitação excluída!',
            align: 'center' as any,
            fontWeight: 'bold' as any,
          },
          text: {
            value:
              'O tomador foi removido da lista, mas se houver entendimento de que ele possa ser mapeado num futuro próximo, você poderá fazer uma nova solicitação.',
            align: 'center' as any,
          },
          icon: <SuccessIllustration />,
        };
      default:
        return undefined;
    }
  };

  return (
    <Modal
      size="default"
      open={isOpen}
      template={getModalTemplate()}
      onBackdropClick={() => onCloseModal()}
      onCloseButtonClick={() => onCloseModal()}
    />
  );
};

export default DeleteMappingRequestItem;
