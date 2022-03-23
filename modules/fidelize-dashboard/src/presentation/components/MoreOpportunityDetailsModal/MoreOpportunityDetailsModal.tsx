import { useRef, useState } from 'react';
import { Button, Modal } from 'junto-design-system';
import { nanoid } from 'nanoid';
import { thousandSeparator } from '@shared/utils';
import { SuccessIllustration } from '@shared/ui';
import {
  ModalityEnum,
  OpportunityRelevanceEnum,
} from '../../../application/types/model';
import styles from './MoreOpportunityDetailsModal.module.scss';
import { getLabelByModality } from '../../../helpers';

interface MoreOpportunityDetailsModalProps {
  modality: ModalityEnum;
  relevance: OpportunityRelevanceEnum;
  type: string;
  expiration: string | null;
  securityAmount: number;
  policyholder: string;
  mappingDate: string;
}

const MoreOpportunityDetailsModal: React.FC<MoreOpportunityDetailsModalProps> =
  ({
    modality,
    relevance,
    type,
    expiration,
    securityAmount,
    policyholder,
    mappingDate,
  }) => {
    const btnRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const renderOpportunityData = () => {
      const data = [
        { label: 'Tomador', value: policyholder },
        { label: 'Tipo/Obs', value: `${type} - ${expiration}` },
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
      setHasSubmitted(true);
    };

    const handleModalClose = () => {
      setModalOpen(false);
      setHasSubmitted(false);
    };

    return (
      <>
        <button
          ref={btnRef}
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
                <Button onClick={() => handleSubmit()}>
                  Solicitar detalhes
                </Button>
              </div>
            </>
          )}
        </Modal>
      </>
    );
  };

export default MoreOpportunityDetailsModal;
