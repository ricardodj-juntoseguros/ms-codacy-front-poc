import {
  FunctionComponent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Divider, LinkButton, makeToast } from 'junto-design-system';
import {
  BrokerPlatformAuthService,
  IncentiveTrailService,
  ProfileEnum,
} from '@services';
import { differenceInDays } from 'date-fns';
import { NO_ACCEPT_LIST_VALUES } from '../../../constants';
import { incentiveTrailAdapter } from '../../../application/features/incentiveTrail/adapters/IncentiveTrailAdapter';
import IncentiveTrailApi from '../../../application/features/incentiveTrail/IncentiveTrailApi';
import { IncentiveTrail } from '../../../application/types/model';
import IncentiveTrailHeader from '../../components/IncentiveTrailHeader';
import IncentiveTrailSummary from '../../components/IncentiveTrailSummary';
import IncentiveTrailList from '../../components/IncentiveTrailList';
import IncentiveTrailAcceptModal from '../../components/IncentiveTrailAcceptModal';
import styles from './IncentiveTrailContainer.module.scss';

const IncentiveTrailContainer: FunctionComponent = () => {
  const [toogleAcceptModal, setToogleAcceptModal] = useState(false);
  const [campaignData, setCampaignData] = useState<IncentiveTrail | null>(null);
  const [loadingCampaignData, setLoadingCampaignData] = useState(false);
  const campaignConfig = IncentiveTrailService.getIncentiveTrailCampaign();
  const broker = BrokerPlatformAuthService.getBroker();
  const isEligible = IncentiveTrailService.getIncentiveTrailIsEligible();
  const isAccept = IncentiveTrailService.getIncentiveTrailIsAccept();
  const profile = BrokerPlatformAuthService.getUserProfile();

  useLayoutEffect(() => {
    const brokerProcessUrl = process.env.NX_GLOBAL_BROKER_PROCESSES_URL || '';
    if (!isEligible) window.location.assign(brokerProcessUrl);
  }, [isEligible]);

  useEffect(() => {
    const dateLimit = campaignConfig?.dateLimitAccept
      ? new Date(campaignConfig?.dateLimitAccept)
      : new Date();
    const daysLeftForAcceptance = differenceInDays(dateLimit, new Date());
    if (
      isEligible &&
      !isAccept &&
      daysLeftForAcceptance > 0 &&
      profile === ProfileEnum.BROKER
    ) {
      setToogleAcceptModal(true);
    }
  }, [isEligible, isAccept, campaignConfig?.dateLimitAccept, profile]);

  useEffect(() => {
    if (isEligible && isAccept) {
      getIncentiveTrailCampaignData();
    } else {
      setCampaignData(NO_ACCEPT_LIST_VALUES);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIncentiveTrailCampaignData = useCallback(async () => {
    if (!campaignConfig || !broker) return;
    const { campaignId } = campaignConfig;
    const { federalId } = broker;
    const isCommercial = profile === ProfileEnum.COMMERCIAL;
    setLoadingCampaignData(true);
    await IncentiveTrailApi.getCampaignData(campaignId, federalId, isCommercial)
      .then(result => setCampaignData(incentiveTrailAdapter(result)))
      .catch(() => {
        makeToast('error', 'Houve um erro ao buscar os dados da campanha');
        setCampaignData(NO_ACCEPT_LIST_VALUES);
      })
      .finally(() => setLoadingCampaignData(false));
  }, [broker, campaignConfig, profile]);

  const renderLastUpdate = () => {
    if (!campaignData?.lastUpdate) return null;
    return (
      <p className={styles['incentive-trail-container__last-update']}>
        *Dados atualizados em {campaignData?.lastUpdate}.
      </p>
    );
  };

  const handleToogleAcceptModal = () => {
    setToogleAcceptModal(!toogleAcceptModal);
  };

  const handleGoToProcessList = () => {
    const brokerProcessUrl = process.env.NX_GLOBAL_BROKER_PROCESSES_URL || '';
    window.location.assign(brokerProcessUrl);
  };

  return (
    <>
      <header className={styles['incentive-trail-container__header']}>
        <LinkButton
          label="Ir para lista de processos"
          icon="arrow-left"
          onClick={() => handleGoToProcessList()}
        />
      </header>
      <section className={styles['incentive-trail-container__wrapper']}>
        <IncentiveTrailHeader />
        <div className={styles['incentive-trail-container__divider']}>
          <Divider />
        </div>
        <IncentiveTrailSummary
          dateStart={campaignConfig?.dateStart}
          accumulatedValue={campaignData?.accumulatedValue}
          isAccept={isAccept}
          onToogleAcceptModal={handleToogleAcceptModal}
          loading={loadingCampaignData}
          profile={profile}
        />
        <IncentiveTrailList
          steps={campaignData?.steps}
          loading={loadingCampaignData}
        />
        {renderLastUpdate()}
        <IncentiveTrailAcceptModal
          onCloseModal={handleToogleAcceptModal}
          onGetIncentiveTrailCampaignData={getIncentiveTrailCampaignData}
          toogleModal={toogleAcceptModal}
          campaignId={campaignConfig?.campaignId}
        />
      </section>
    </>
  );
};

export default IncentiveTrailContainer;
