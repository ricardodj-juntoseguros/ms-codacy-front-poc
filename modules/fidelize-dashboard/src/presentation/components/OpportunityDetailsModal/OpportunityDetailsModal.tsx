import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'junto-design-system';
import TagManager from 'react-gtm-module';
import { SuccessIllustration, MailIllustration } from '@shared/ui';
import OpportunityDetailsModalConfirm from '../OpportunityDetailsModalConfirm';
import OpportunityDetailsModalMail from '../OpportunityDetailsModalMail';
import { ModalityEnum } from '../../../application/types/model';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import OpportunitiesDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import {
  opportunitiesDetailsActions,
  selectSelectedOpportunities,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import styles from './OpportunityDetailsModal.module.scss';

interface OpportunityDetailsModalProps {
  modality: ModalityEnum;
  opportunity?: OpportunityDetailsItemDTO | null;
  onModalClose: () => void;
}

type ModalFlowStep = 'CONFIRM' | 'EMAIL' | 'COMPLETED';
type PolicyholderValidationStatus = 'OK' | 'LOADING' | 'INVALID' | 'ERROR';

const OpportunityDetailsModal: React.FC<OpportunityDetailsModalProps> = ({
  modality,
  opportunity,
  onModalClose,
}) => {
  const dispatch = useDispatch();
  const selectedOpportunities = useSelector(selectSelectedOpportunities);
  const isOnlyOneOpportunity =
    opportunity || selectedOpportunities.length === 1;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalFlowStep>('CONFIRM');
  const [validPolicyholder, setValidPolicyholder] =
    useState<PolicyholderValidationStatus>(
      isOnlyOneOpportunity ? 'LOADING' : 'OK',
    );

  useEffect(() => {
    if (isOnlyOneOpportunity) {
      const opportunityId = opportunity
        ? opportunity.id
        : selectedOpportunities[0].id;
      OpportunitiesDetailsApi.getOpportunityCompleteDetailsByModalityAndId(
        modality,
        opportunityId,
      )
        .then(response =>
          setValidPolicyholder(response.hasLimit ? 'OK' : 'INVALID'),
        )
        .catch(() => setValidPolicyholder('ERROR'));
    } else {
      setValidPolicyholder('OK');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getModalTemplate = () => {
    switch (currentStep) {
      case 'CONFIRM':
        return {
          title: {
            value: 'Quero mais detalhes!',
            align: (isOnlyOneOpportunity ? 'left' : 'center') as any,
          },
          text: {
            value: isOnlyOneOpportunity
              ? 'Confirme os dados da oportunidade que você deseja obter mais detalhes, que em breve te retornaremos com as informações adicionais (como número de CNJ, entre outras).'
              : `Você selecionou ${selectedOpportunities.length} oportunidades para obter mais detalhes. Clique no botão abaixo que te retornaremos com as informações adicionais (como número de CNJ, entre outras)`,
            align: (isOnlyOneOpportunity ? 'left' : 'center') as any,
          },
        };
      case 'EMAIL':
        return {
          title: {
            value:
              validPolicyholder === 'OK'
                ? 'Enviaremos as informações no seu e-mail!'
                : 'Entraremos em contato por e-mail!',
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
              validPolicyholder === 'OK'
                ? 'Em breve, entraremos em contato enviando as informações solicitadas.'
                : 'Já encaminhamos seu interesse ao time comercial.',
            align: 'center' as any,
          },
          icon: <SuccessIllustration />,
        };
      default:
        return undefined;
    }
  };

  const fireTagManagerEvent = () => {
    const opportunityId = isOnlyOneOpportunity
      ? opportunity?.id || selectedOpportunities[0].id
      : undefined;
    const opportunityCount = isOnlyOneOpportunity
      ? 1
      : selectedOpportunities.length;
    TagManager.dataLayer({
      dataLayer: {
        event: 'ClickMoreOpportunityDetailsSubmit',
        opportunityId,
        opportunityCount,
      },
    });
  };

  const handleSubmit = (email: string) => {
    setIsSubmitting(true);
    fireTagManagerEvent();
    const opportunitiesIds = opportunity
      ? [opportunity.id]
      : selectedOpportunities.map(op => op.id);

    OpportunitiesDetailsApi.sendMoreDetailsFromOpportunityList(
      modality,
      opportunitiesIds,
      [email],
    )
      .then(() => {
        dispatch(opportunitiesDetailsActions.clearOpportunitySelection());
        setCurrentStep('COMPLETED');
        setSubmitError(false);
      })
      .catch(() => setSubmitError(true))
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleModalClose = () => {
    setCurrentStep('CONFIRM');
    setIsSubmitting(false);
    setSubmitError(false);
    onModalClose();
  };

  const getModalSize = () => {
    return currentStep === 'CONFIRM' && isOnlyOneOpportunity
      ? 'large'
      : 'default';
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

  const renderContentByStep = (step: ModalFlowStep) => {
    if (step === 'CONFIRM') {
      return (
        <OpportunityDetailsModalConfirm
          modality={modality}
          opportunities={opportunity ? [opportunity] : selectedOpportunities}
          isSubmitting={isSubmitting}
          validPolicyholder={validPolicyholder}
          onSubmit={() => setCurrentStep('EMAIL')}
          renderError={renderSubmitError}
          renderDisclaimer={renderDisclaimer}
        />
      );
    }
    if (step === 'EMAIL') {
      return (
        <OpportunityDetailsModalMail
          onSubmit={value => handleSubmit(value)}
          isSubmitting={isSubmitting}
          renderSubmitError={renderSubmitError}
        />
      );
    }
    return null;
  };

  return (
    <Modal
      open
      onClose={() => handleModalClose()}
      onBackdropClick={() => handleModalClose()}
      size={getModalSize()}
      template={getModalTemplate()}
    >
      {renderContentByStep(currentStep)}
    </Modal>
  );
};

export default OpportunityDetailsModal;
