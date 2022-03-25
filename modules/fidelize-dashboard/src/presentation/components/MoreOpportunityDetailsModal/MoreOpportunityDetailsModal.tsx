import { useRef, useState } from 'react';
import { Button, Modal } from 'junto-design-system';
import { nanoid } from 'nanoid';
import { thousandSeparator } from '@shared/utils';
import { SuccessIllustration } from '@shared/ui';
import { getLabelByModality } from '../../../helpers';
import { ModalityEnum } from '../../../application/types/model';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import OpportunityDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import styles from './MoreOpportunityDetailsModal.module.scss';

interface MoreOpportunityDetailsModalProps {
  modality: ModalityEnum;
  opportunity: OpportunityDetailsItemDTO;
}

const MoreOpportunityDetailsModal: React.FC<MoreOpportunityDetailsModalProps> =
  ({ modality, opportunity }) => {
    const btnRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(false);
    const {
      id,
      category,
      policyholder,
      securityAmount,
      expiration,
      mappingDate,
      relevance,
    } = opportunity;

    const renderOpportunityData = () => {
      const data = [
        { label: 'Tomador', value: policyholder },
        { label: 'Tipo/Obs', value: `${category} - ${expiration}` },
        {
          label: 'Importância segurada',
          value: `R$ ${thousandSeparator(securityAmount, '.', 2)}`,
        },
        { label: 'Data do mapeamento', value: mappingDate },
        { label: 'Relevância', value: relevance },
      ];
      return data.map(item => {
        return (
          <div key={`data-item-${nanoid(3)}`}>
            <p
              className={styles['more-opportunity-details-modal__field-label']}
            >
              {item.label}:
            </p>
            <p
              className={styles['more-opportunity-details-modal__field-value']}
            >
              {item.value}
            </p>
          </div>
        );
      });
    };

    const getModalTemplate = () => {
      if (hasSubmitted) {
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
      }
      return {
        title: {
          value: 'Quero mais detalhes!',
        },
        text: {
          value:
            'Confirme os dados da oportunidade que você deseja obter mais detalhes, que em breve te retornaremos com as informações adicionais (como número de CNJ, entre outras).',
        },
      };
    };

    const handleSubmit = () => {
      setIsSubmitting(true);
      OpportunityDetailsApi.sendMoreOpportunityDetailsMail(id)
        .then(() => setHasSubmitted(true))
        .catch(() => setSubmitError(true))
        .finally(() => {
          setIsSubmitting(false);
        });
    };

    const handleModalClose = () => {
      setModalOpen(false);
      setHasSubmitted(false);
      setIsSubmitting(false);
      setSubmitError(false);
    };

    return (
      <>
        <button
          ref={btnRef}
          data-testid="modal-trigger"
          type="button"
          className={styles['more-opportunity-details-modal__trigger']}
          onClick={() => setModalOpen(true)}
        >
          <i className="icon icon-plus-circle" />
        </button>
        <Modal
          open={modalOpen}
          onClose={() => handleModalClose()}
          onBackdropClick={() => handleModalClose()}
          size={hasSubmitted ? 'default' : 'large'}
          template={getModalTemplate()}
        >
          {!hasSubmitted && (
            <>
              <p
                className={
                  styles['more-opportunity-details-modal__content-title']
                }
              >
                Oportunidade {getLabelByModality(modality)} selecionada:
              </p>
              <div
                className={
                  styles['more-opportunity-details-modal__opportunity-data']
                }
              >
                {renderOpportunityData()}
              </div>
              <div
                className={
                  styles['more-opportunity-details-modal__submit-wrapper']
                }
              >
                {submitError && (
                  <div
                    className={styles['more-opportunity-details-modal__error']}
                  >
                    Ocorreu um erro inesperado ao realizar a sua solicitação.
                    Por favor, tente novamente.
                  </div>
                )}
                <Button
                  data-testid="submit-more-details"
                  onClick={() => handleSubmit()}
                >
                  {isSubmitting
                    ? ((<i className="icon icon-loading" />) as any)
                    : 'Solicitar detalhes'}
                </Button>
              </div>
            </>
          )}
        </Modal>
      </>
    );
  };

export default MoreOpportunityDetailsModal;
