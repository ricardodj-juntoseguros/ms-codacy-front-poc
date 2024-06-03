import { Button, Modal } from 'junto-design-system';
import { FunctionComponent, useMemo } from 'react';
import styles from './CommercialAuthorizationModal.module.scss';
import { CommercialAuthorizationTypeEnum } from '../../../application/types/model';
import { COMMERCIAL_AUTHORIZATION_MODAL_DATA } from '../../../constants';

interface CommercialAuthorizationModalProps {
  isModalOpen: boolean;
  onToggleModal: (type: boolean) => void;
  onConfirm: () => Promise<void>;
  modalType: CommercialAuthorizationTypeEnum;
}

const CommercialAuthorizationModal: FunctionComponent<CommercialAuthorizationModalProps> =
  ({ isModalOpen, onToggleModal, onConfirm, modalType }) => {
    const currentTypeConfig = useMemo(
      () =>
        modalType
          ? COMMERCIAL_AUTHORIZATION_MODAL_DATA[modalType]
          : COMMERCIAL_AUTHORIZATION_MODAL_DATA.sendToApproval,
      [modalType],
    );

    const getIcon = () => {
      const Icon = currentTypeConfig.icon;
      return <Icon />;
    };

    const handleSubmit = async () => {
      onToggleModal(false);
      onConfirm();
    };

    return (
      <Modal
        open={isModalOpen}
        onClose={() => onToggleModal(false)}
        size="large"
      >
        <div className={styles['commercial-authorization-modal__wrapper']}>
          {getIcon()}
          <h2 className={styles['commercial-authorization-modal__title']}>
            {currentTypeConfig.title}
          </h2>
          <p className={styles['commercial-authorization-modal__description']}>
            {currentTypeConfig.description}
          </p>
          <footer className={styles['commercial-authorization-modal__footer']}>
            <Button
              id="commercialAuthorizationModal-button-submit"
              data-testid="commercialAuthorizationModal-button-submit"
              onClick={() => handleSubmit()}
            >
              {currentTypeConfig.buttonsLabels.primary}
            </Button>
            <Button
              id="commercialAuthorizationModal-button-close"
              data-testid="commercialAuthorizationModal-button-close"
              onClick={() => onToggleModal(false)}
              variant="secondary"
            >
              {currentTypeConfig.buttonsLabels.secondary}
            </Button>
          </footer>
        </div>
      </Modal>
    );
  };

export default CommercialAuthorizationModal;
