import { FunctionComponent, useCallback, useState } from 'react';
import {
  Button,
  Checkbox,
  LinkButton,
  Modal,
  makeToast,
} from 'junto-design-system';
import { BrokerPlatformAuthService, IncentiveTrailService } from '@services';
import TagManager from 'react-gtm-module';
import { format } from 'date-fns';
import { redirectIncentiveTrailTerms } from '../../../helpers';
import IncentiveTrailApi from '../../../application/features/incentiveTrail/IncentiveTrailApi';
import styles from './IncentiveTrailAcceptModal.module.scss';

interface IncentiveTrailAcceptModalProps {
  onCloseModal: () => void;
  onGetIncentiveTrailCampaignData: () => void;
  toogleModal: boolean;
  campaignId?: number;
}

const IncentiveTrailAcceptModal: FunctionComponent<IncentiveTrailAcceptModalProps> =
  ({
    onCloseModal,
    toogleModal,
    campaignId,
    onGetIncentiveTrailCampaignData,
  }) => {
    const [checkBoxTerms, setCheckBoxTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const broker = BrokerPlatformAuthService.getBroker();

    const handleCheckBoxTerms = (isChecked: boolean) => {
      setCheckBoxTerms(isChecked);
    };

    const handleSubmit = useCallback(
      async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!campaignId) return;
        setLoading(true);
        await IncentiveTrailApi.postAcceptIncentiveTrail(campaignId)
          .then(() => {
            IncentiveTrailService.updateIncentiveTrailAcceptTerm(true);
            TagManager.dataLayer({
              dataLayer: {
                event: 'ClickAcceptIncentiveTrailTerms',
                brokerName: broker?.name,
                acceptDate: format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
              },
            });
            onCloseModal();
            onGetIncentiveTrailCampaignData();
          })
          .catch(() =>
            makeToast(
              'error',
              'Houve um erro ao aceitar os termos da campanha',
            ),
          )
          .finally(() => setLoading(false));
      },
      [broker, campaignId, onCloseModal, onGetIncentiveTrailCampaignData],
    );

    return (
      <Modal
        open={toogleModal}
        onClose={() => onCloseModal()}
        onBackdropClick={() => onCloseModal()}
      >
        <form
          id="incentiveTrailAcceptModal-form"
          data-testid="incentiveTrailAcceptModal-form"
          className={styles['incentive-trail-accept-modal__wrapper']}
          onSubmit={e => handleSubmit(e)}
        >
          <h2 className={styles['incentive-trail-accept-modal__title']}>
            Acompanhe seus resultados a qualquer momento!
          </h2>
          <p className={styles['incentive-trail-accept-modal__text']}>
            Participe agora e tenha acesso fácil aos detalhes de sua produção.
          </p>
          <div className={styles['incentive-trail-accept-modal__terms']}>
            <Checkbox
              id="incentiveTrailAcceptModal-checkbox-terms"
              data-testid="incentiveTrailAcceptModal-checkbox-terms"
              checked={checkBoxTerms}
              onChange={isChecked => handleCheckBoxTerms(isChecked)}
            />
            <span>Li e concordo com o&nbsp;</span>
            <LinkButton
              id="incentiveTrailAcceptModal-linkButton-redirect-terms"
              data-testid="incentiveTrailAcceptModal-linkButton-redirect-terms"
              onClick={() => redirectIncentiveTrailTerms()}
              label="Regulamento"
            />
          </div>
          <Button
            id="incentiveTrailAcceptModal-button-submit"
            data-testid="incentiveTrailAcceptModal-button-submit"
            type="submit"
            disabled={!checkBoxTerms || loading}
            loading={loading}
          >
            Quero participar
          </Button>
        </form>
      </Modal>
    );
  };

export default IncentiveTrailAcceptModal;
