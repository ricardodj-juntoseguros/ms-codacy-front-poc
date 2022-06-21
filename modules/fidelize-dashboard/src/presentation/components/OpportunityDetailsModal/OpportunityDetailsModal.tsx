import { useRef, useState } from 'react';
import { Modal } from 'junto-design-system';
import TagManager from 'react-gtm-module';
import { SuccessIllustration, MailIllustration } from '@shared/ui';
import { ModalityEnum } from '../../../application/types/model';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import OpportunityDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import OpportunityDetailsModalConfirm from '../OpportunityDetailsModalConfirm';
import OpportunityDetailsModalMail from '../OpportunityDetailsModalMail';
import styles from './OpportunityDetailsModal.module.scss';

interface OpportunityDetailsModalProps {
  modality: ModalityEnum;
  opportunity: OpportunityDetailsItemDTO;
}

type ModalFlowStep = 'CONFIRM' | 'EMAIL' | 'COMPLETED';

const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  modality,
  opportunity,
}) => {
  const btnRef = useRef(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalFlowStep>('CONFIRM');

  const { id } = opportunity;

  const getModalTemplate = () => {
    switch (currentStep) {
      case 'CONFIRM':
        return {
          title: {
            value: 'Quero mais detalhes!',
          },
          text: {
            value:
              'Confirme os dados da oportunidade que você deseja obter mais detalhes, que em breve te retornaremos com as informações adicionais (como número de CNJ, entre outras).',
          },
        };
      case 'EMAIL':
        return {
          title: {
            value: 'Enviaremos as informações no seu e-mail!',
            align: 'center' as any,
          },
          icon: <MailIllustration />,
        };
      case 'COMPLETED':
        return {
          title: {
            value: 'Agora é só aguardar',
            align: 'center' as any,
          },
          text: {
            value:
              'Em breve, entraremos em contato enviando as informações solicitadas.',
            align: 'center' as any,
          },
          icon: <SuccessIllustration />,
        };
      default:
        return undefined;
    }
  };

  const renderSubmitError = () => {
    return submitError ? (
      <div className={styles['opportunity-details-modal__error']}>
        Ocorreu um erro inesperado ao realizar a sua solicitação. Por favor,
        tente novamente.
      </div>
    ) : null;
  };

  const renderDisclaimer = () => (
    <div className={styles['opportunity-details-modal__disclaimer']}>
      <p>
        Consulte as condições do produto. A aceitação do seguro estará sempre
        condicionada à análise do risco, e exigirá por parte do Tomador a
        comprovação de capacidade técnica e financeira, e o cumprimento de
        eventuais exigências cadastral e de subscrição.
      </p>
    </div>
  );

  const handleSubmit = (submit: Promise<any>) => {
    setIsSubmitting(true);
    TagManager.dataLayer({
      dataLayer: {
        event: 'ClickMoreOpportunityDetailsSubmit',
        opportunityId: id,
      },
    });
    submit
      .then(() => {
        setCurrentStep('COMPLETED');
        setSubmitError(false);
      })
      .catch(() => setSubmitError(true))
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleConfirmSubmit = () => {
    if (modality === ModalityEnum.TRABALHISTA) {
      setCurrentStep('EMAIL');
      return;
    }
    handleSubmit(OpportunityDetailsApi.sendMoreOpportunityDetailsMail(id));
  };

  const handleEmailSubmit = (email: string) => {
    handleSubmit(
      OpportunityDetailsApi.sendMoreDetailsFromOpportunityList(
        modality,
        [id],
        [email],
      ),
    );
  };

  const handleTriggerClick = () => {
    setModalOpen(true);
    TagManager.dataLayer({
      dataLayer: {
        event: 'ClickMoreOpportunityDetailsButton',
        opportunityId: id,
      },
    });
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setCurrentStep('CONFIRM');
    setIsSubmitting(false);
    setSubmitError(false);
  };

  const renderContentByStep = (step: ModalFlowStep) => {
    if (step === 'CONFIRM') {
      return (
        <OpportunityDetailsModalConfirm
          modality={modality}
          opportunity={opportunity}
          isSubmitting={isSubmitting}
          onSubmit={handleConfirmSubmit}
          renderError={renderSubmitError}
          renderDisclaimer={renderDisclaimer}
        />
      );
    }
    if (step === 'EMAIL') {
      return (
        <OpportunityDetailsModalMail
          onSubmit={v => handleEmailSubmit(v)}
          isSubmitting={isSubmitting}
          renderSubmitError={renderSubmitError}
        />
      );
    }
    return null;
  };

  return (
    <>
      <button
        ref={btnRef}
        data-testid="modal-trigger"
        type="button"
        className={styles['opportunity-details-modal__trigger']}
        onClick={() => handleTriggerClick()}
      >
        <i className="icon icon-plus-circle" />
      </button>
      <Modal
        open={modalOpen}
        onClose={() => handleModalClose()}
        onBackdropClick={() => handleModalClose()}
        size={currentStep === 'CONFIRM' ? 'large' : 'default'}
        template={getModalTemplate()}
      >
        {renderContentByStep(currentStep)}
      </Modal>
    </>
  );
};

export default OpportunityDetailsModal;
