import { FunctionComponent } from 'react';
import { LinkButton, Modal } from 'junto-design-system';
import { redirectIncentiveTrailTerms } from '../../../helpers';
import styles from './IncentiveTrailRedeemModal.module.scss';

interface IncentiveTrailRedeemModalProps {
  onCloseModal: () => void;
  toogleModal: boolean;
}

const IncentiveTrailRedeemModal: FunctionComponent<IncentiveTrailRedeemModalProps> =
  ({ onCloseModal, toogleModal }) => {
    return (
      <Modal
        open={toogleModal}
        onClose={() => onCloseModal()}
        onBackdropClick={() => onCloseModal()}
      >
        <div className={styles['incentive-trail-redeem-modal__wrapper']}>
          <h2 className={styles['incentive-trail-redeem-modal__title']}>
            Emissão da Nota Fiscal
          </h2>
          <p className={styles['incentive-trail-redeem-modal__text']}>
            Para realizar o resgate de seu bônus, solicitamos o envio da nota
            fiscal até a data estipulada para: incentivo@juntoseguros.com
          </p>
          <p className={styles['incentive-trail-redeem-modal__sub-text']}>
            Fique atento às regras de preenchimento da nota e prazo de envio.
          </p>
          <LinkButton
            id="incentiveTrailRedeemModal-linkButton-terms"
            data-testid="incentiveTrailRedeemModal-linkButton-terms"
            label="Clique e confira todas as informações"
            onClick={() => redirectIncentiveTrailTerms()}
          />
        </div>
      </Modal>
    );
  };

export default IncentiveTrailRedeemModal;
