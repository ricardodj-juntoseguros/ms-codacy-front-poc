import { useState, useEffect } from 'react';
import { Divider, Tabs, Tab } from 'junto-design-system';
import { useSelector, useDispatch } from 'react-redux';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardSummary from '../../components/DashboardSummary';
import ModalitySummary from '../../components/ModalitySummary';
import { ModalitySummarySkeleton } from '../../components/Skeletons';
import ModalityUnderConstruction from '../../components/ModalityUnderConstruction';
import OpportunityDetailsList from '../../components/OpportunityDetailsList';
import PolicyholderFilterSelector from '../../components/PolicyholderFilterSelector';
import {
  selectModality,
  modalitySelectionSliceActions,
} from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import { selectPolicyholderSelection } from '../../../application/features/policyholderFilter/PolicyholderFilterSlice';
import SummaryApi from '../../../application/features/summary/SummaryApi';
import { ModalityEnum } from '../../../application/types/model';
import { ModalitySummaryDTO } from '../../../application/types/dto';
import styles from './DashboardContainer.module.scss';

function DashboardContainer() {
  const dispatch = useDispatch();
  const { selectedModality } = useSelector(selectModality);
  const filteredPolicyholders = useSelector(selectPolicyholderSelection);
  const [loadingModalitySummary, setLoadingModalitySummary] = useState(true);
  const [errorModalitySummary, setErrorModalitySummary] = useState(false);
  const [modalitiesSummaryData, setModalitiesSummaryData] = useState<
    ModalitySummaryDTO[]
  >([]);

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
    dispatch(
      modalitySelectionSliceActions.setSelectedModality(
        selectedTab as ModalityEnum,
      ),
    );
  };

  const getDataToRender = (modality: ModalityEnum) => {
    return (
      modalitiesSummaryData.find(data => data.modality === modality) || {
        modality,
        totalOpportunities: 0,
        totalInsuredAmount: 0,
      }
    );
  };

  const {
    totalOpportunities: fiscalOpportunities,
    totalInsuredAmount: fiscalIS,
  } = getDataToRender(ModalityEnum.FISCAL);

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
          <Tab
            value={ModalityEnum.TRABALHISTA}
            label="Trabalhista"
            totalizer={loadingModalitySummary ? null : 0}
            disabled={loadingModalitySummary}
          >
            <ModalityUnderConstruction />
          </Tab>
          <Tab
            value={ModalityEnum.FISCAL}
            label="Fiscal"
            totalizer={loadingModalitySummary ? null : fiscalOpportunities}
            disabled={loadingModalitySummary}
          >
            {loadingModalitySummary ? (
              <ModalitySummarySkeleton />
            ) : (
              <ModalitySummary
                modality={ModalityEnum.FISCAL}
                totalOpportunities={fiscalOpportunities}
                totalInsuredValue={fiscalIS}
                hasError={errorModalitySummary}
              />
            )}
            <OpportunityDetailsList modality={ModalityEnum.FISCAL} />
          </Tab>
          <Tab
            value={ModalityEnum.CIVIL}
            label="Cível"
            totalizer={loadingModalitySummary ? null : 0}
            disabled={loadingModalitySummary}
          >
            <ModalityUnderConstruction />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardContainer;
