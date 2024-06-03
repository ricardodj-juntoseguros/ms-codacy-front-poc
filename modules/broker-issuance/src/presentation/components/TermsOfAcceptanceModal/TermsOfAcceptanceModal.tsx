import { FunctionComponent } from 'react';
import { Button, Modal } from 'junto-design-system';
import { JuntoLogoDark } from '@shared/ui';
import { TERMS_AND_CONDITIONS } from '../../../constants';

import styles from './TermsOfAcceptanceModal.module.scss';

export interface TermsOfAcceptanceModalProps {
  isModalOpen: boolean;
  onToggleModal: (type: boolean) => void;
}

const TermsOfAcceptanceModal: FunctionComponent<TermsOfAcceptanceModalProps> =
  ({ isModalOpen, onToggleModal }) => {
    return (
      <Modal
        open={isModalOpen}
        onClose={() => onToggleModal(false)}
        size="large"
      >
        <header className={styles['terms-of-acceptance-modal__header']}>
          <JuntoLogoDark />
        </header>
        <section className={styles['terms-of-acceptance-modal__content']}>
          <h2 className={styles['terms-of-acceptance-modal__title']}>
            {TERMS_AND_CONDITIONS.termsOfAcceptance.title}
          </h2>
          <p className={styles['terms-of-acceptance-modal__text']}>
            {TERMS_AND_CONDITIONS.termsOfAcceptance.text}
          </p>
          <p className={styles['terms-of-acceptance-modal__awareness']}>
            {TERMS_AND_CONDITIONS.termsOfAcceptance.awareness}
          </p>
        </section>
        <footer className={styles['terms-of-acceptance-modal__footer']}>
          <Button
            id="termsOfAcceptanceModal-button-close"
            data-testid="termsOfAcceptanceModal-button-close"
            type="button"
            onClick={() => onToggleModal(false)}
          >
            Ok, entendi.
          </Button>
        </footer>
      </Modal>
    );
  };

export default TermsOfAcceptanceModal;
