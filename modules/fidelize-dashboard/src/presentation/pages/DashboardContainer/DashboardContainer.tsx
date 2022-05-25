import { useState, useEffect } from 'react';
import { Divider, Tabs, Tab } from 'junto-design-system';
import { useSelector, useDispatch } from 'react-redux';
import TagManager from 'react-gtm-module';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardSummary from '../../components/DashboardSummary';
import ModalitySummary from '../../components/ModalitySummary';
import { ModalitySummarySkeleton } from '../../components/Skeletons';
import ModalityUnderConstruction from '../../components/ModalityUnderConstruction';
import ModalityNotAvailable from '../../components/ModalityNotAvailable';
import OpportunityDetailsList from '../../components/OpportunityDetailsList';
import PolicyholderFilterSelector from '../../components/PolicyholderFilterSelector';
import {
  selectModality,
  modalitySelectionSliceActions,
} from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import {
  checkAccessToFeature,
  fetchAccessToFeature,
} from '../../../application/features/accessCheck/AccessCheckSlice';
import { selectPolicyholderSelection } from '../../../application/features/policyholderFilter/PolicyholderFilterSlice';
import SummaryApi from '../../../application/features/summary/SummaryApi';
import { ModalityEnum } from '../../../application/types/model';
import { ModalitySummaryDTO } from '../../../application/types/dto';
import { MODALITIES_IDS } from '../../../constants';
import { getLabelByModality } from '../../../helpers';
import styles from './DashboardContainer.module.scss';

function DashboardContainer() {
  const dispatch = useDispatch();

  const { selectedModality } = useSelector(selectModality);
  const hasAccessToLaborModality = useSelector(
    checkAccessToFeature('TRABALHISTA'),
  );
  const filteredPolicyholders = useSelector(selectPolicyholderSelection);

  const [loadingModalitySummary, setLoadingModalitySummary] = useState(true);
  const [errorModalitySummary, setErrorModalitySummary] = useState(false);
  const [modalitiesSummaryData, setModalitiesSummaryData] = useState<
    ModalitySummaryDTO[]
  >([]);

  useEffect(() => {
    dispatch(fetchAccessToFeature('TRABALHISTA'));
  }, [dispatch]);

  useEffect(() => {
    setLoadingModalitySummary(true);
    fetchModalitiesSummary(filteredPolicyholders);
  }, [filteredPolicyholders]);

  const fetchModalitiesSummary = (federalIds: string[]) => {
    SummaryApi.getModalitiesSummary(federalIds)
      .then(response => setModalitiesSummaryData(response))
      .catch(() => setErrorModalitySummary(true))
      .finally(() => setLoadingModalitySummary(false));
  };

  const handleModalityTabSelection = (selectedTab: string) => {
    const selectedEnum = selectedTab as ModalityEnum;
    dispatch(modalitySelectionSliceActions.setSelectedModality(selectedEnum));
    TagManager.dataLayer({
      dataLayer: {
        event: 'SelectDashboardModalityTab',
        modalityId: MODALITIES_IDS[selectedEnum],
      },
    });
  };

  const getDataToRender = (modality: ModalityEnum) => {
    return (
      modalitiesSummaryData.find(data => data.modality === modality) || {
        modality,
        totalOpportunities: 0,
        totalInsuredAmount: 0,
        error: false,
      }
    );
  };

  const renderModalitySummary = (modality: ModalityEnum) => {
    if (
      loadingModalitySummary ||
      (modality === ModalityEnum.TRABALHISTA &&
        hasAccessToLaborModality === null)
    ) {
      return <ModalitySummarySkeleton />;
    }

    const { totalInsuredAmount, totalOpportunities, error } =
      getDataToRender(modality);

    return (
      <ModalitySummary
        modality={modality}
        totalOpportunities={totalOpportunities}
        totalInsuredValue={totalInsuredAmount}
        hasError={error}
      />
    );
  };

  const renderModalityTab = (modality: ModalityEnum) => {
    let content = () =>
      modality === ModalityEnum.CIVIL ? (
        <ModalityUnderConstruction />
      ) : (
        <>
          {renderModalitySummary(modality)}
          <OpportunityDetailsList modality={modality} />
        </>
      );
    if (
      modality === ModalityEnum.TRABALHISTA &&
      hasAccessToLaborModality !== null &&
      !hasAccessToLaborModality
    ) {
      content = () => <ModalityUnderConstruction />;
    }

    return (
      <Tab
        value={modality}
        label={getLabelByModality(modality, '', false, true)}
        totalizer={
          loadingModalitySummary
            ? null
            : getDataToRender(modality).totalOpportunities
        }
        disabled={loadingModalitySummary}
      >
        {content()}
      </Tab>
    );
  };

  return (
    <div className={styles['dashboard-container__wrapper']}>
      <DashboardHeader />
      <Divider />
      <PolicyholderFilterSelector />
      <DashboardSummary />
      <h2 className={styles['dashboard-container__modalities-title']}>
        Oportunidades por modalidade
      </h2>
      <div className={styles['dashboard-container__tabs-wrapper']}>
        <Tabs
          activeTab={selectedModality || 'fiscal'}
          onSelectTab={value => handleModalityTabSelection(value)}
          withDivider
        >
          {renderModalityTab(ModalityEnum.TRABALHISTA)}
          {renderModalityTab(ModalityEnum.FISCAL)}
          {renderModalityTab(ModalityEnum.CIVIL)}
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardContainer;
