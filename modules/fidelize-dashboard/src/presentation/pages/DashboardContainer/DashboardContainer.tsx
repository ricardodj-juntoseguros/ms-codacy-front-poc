import { Divider, Tabs, Tab } from 'junto-design-system';
import { useSelector, useDispatch } from 'react-redux';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardSummary from '../../components/DashboardSummary';
import ModalitySummary from '../../components/ModalitySummary';
import {
  selectModality,
  modalitySelectionSliceActions,
} from '../../../application/features/modalitySelection/ModalitySelectionSlice';
import { ModalityEnum } from '../../../application/types/model';
import styles from './DashboardContainer.module.scss';

function DashboardContainer() {
  const dispatch = useDispatch();
  const { selectedModality } = useSelector(selectModality);

  const handleModalityTabSelection = (selectedTab: string) => {
    dispatch(
      modalitySelectionSliceActions.setSelectedModality(
        selectedTab as ModalityEnum,
      ),
    );
  };

  return (
    <div className={styles['dashboard-container__wrapper']}>
      <DashboardHeader />
      <Divider />
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
            totalizer={0}
          />
          <Tab value={ModalityEnum.FISCAL} label="Fiscal" totalizer={7154}>
            <ModalitySummary
              modality={ModalityEnum.FISCAL}
              totalOpportunities={7154}
              totalInsuredValue={286800200}
            />
          </Tab>
          <Tab value={ModalityEnum.CIVEL} label="Cível" totalizer={0} />
        </Tabs>
      </div>
    </div>
  );
}

export default DashboardContainer;
