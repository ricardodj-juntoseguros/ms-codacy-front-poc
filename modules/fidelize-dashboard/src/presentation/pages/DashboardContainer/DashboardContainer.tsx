import { useState, useEffect } from 'react';
import { Divider, Tabs, Tab } from 'junto-design-system';
import { useSelector, useDispatch } from 'react-redux';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardSummary from '../../components/DashboardSummary';
import ModalitySummary from '../../components/ModalitySummary';
import ModalityTabsSkeleton from '../../components/ModalityTabsSkeleton';
import ModalityUnderConstruction from '../../components/ModalityUnderConstruction';
import {
  selectModality,
  modalitySelectionSliceActions,
} from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import SummaryApi from '../../../application/features/summary/SummaryApi';
import { ModalityEnum } from '../../../application/types/model';
import { ModalitySummaryDTO } from '../../../application/types/dto/ModalitySummaryDTO';
import styles from './DashboardContainer.module.scss';

function DashboardContainer() {
  const dispatch = useDispatch();
  const { selectedModality } = useSelector(selectModality);
  const [loadingModalities, setLoadingModalities] = useState(true);
  const [errorModalitySummary, setErrorModalitySummary] = useState(false);
  const [modalitiesSummaryData, setModalitiesSummaryData] = useState<
    ModalitySummaryDTO[]
  >([]);

  useEffect(() => {
    fetchModalitiesSummary();
  }, []);

  const fetchModalitiesSummary = () => {
    SummaryApi.getModalitiesSummary()
      .then(response => setModalitiesSummaryData(response))
      .catch(() => setErrorModalitySummary(true))
      .finally(() => setLoadingModalities(false));
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
      <DashboardSummary />
      <h2 className={styles['dashboard-container__modalities-title']}>
        Oportunidades por modalidade
      </h2>
      <div className={styles['dashboard-container__tabs-wrapper']}>
        {loadingModalities ? (
          <ModalityTabsSkeleton />
        ) : (
          <Tabs
            activeTab={selectedModality || 'fiscal'}
            onSelectTab={value => handleModalityTabSelection(value)}
            withDivider
          >
            <Tab
              value={ModalityEnum.TRABALHISTA}
              label="Trabalhista"
              totalizer={0}
            >
              <ModalityUnderConstruction />
            </Tab>
            <Tab
              value={ModalityEnum.FISCAL}
              label="Fiscal"
              totalizer={fiscalOpportunities}
            >
              <ModalitySummary
                modality={ModalityEnum.FISCAL}
                totalOpportunities={fiscalOpportunities}
                totalInsuredValue={fiscalIS}
                hasError={errorModalitySummary}
              />
            </Tab>
            <Tab value={ModalityEnum.CIVIL} label="Cível" totalizer={0}>
              <ModalityUnderConstruction />
            </Tab>
          </Tabs>
        )}
      </div>
    </div>
  );
}

export default DashboardContainer;
