import { useState, useEffect, useRef } from 'react';
import { Divider, Tabs, Tab } from 'junto-design-system';
import { useSelector, useDispatch } from 'react-redux';
import TagManager from 'react-gtm-module';
import { ModalitiesSummaryDTO } from 'modules/fidelize-dashboard/src/application/types/dto';
import DashboardHeader from '../../components/DashboardHeader';
import DashboardSummary from '../../components/DashboardSummary';
import ModalitySummary from '../../components/ModalitySummary';
import { ModalitySummarySkeleton } from '../../components/Skeletons';
import ModalityUnderConstruction from '../../components/ModalityUnderConstruction';
import ModalityNotAvailable from '../../components/ModalityNotAvailable';
import OpportunityDetailsList from '../../components/OpportunityDetailsList';
import PolicyholderFilterSelector from '../../components/PolicyholderFilterSelector';
import ModalitySummaryCharts from '../../components/ModalitySummaryCharts';
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
import { MODALITIES_IDS } from '../../../constants';
import {
  getLabelByModality,
  renderOpportunitySelectionLossModal,
} from '../../../helpers';
import styles from './DashboardContainer.module.scss';
import { AccessFeatureEnum } from '../../../application/types/model/AccessFeatureEnum';
import { selectSelectedOpportunities } from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';

function DashboardContainer() {
  const dispatch = useDispatch();

  const { selectedModality } = useSelector(selectModality);
  const hasAccessToLaborModality = useSelector(
    checkAccessToFeature(AccessFeatureEnum.LABOR_MODALITY),
  );
  const filteredPolicyholders = useSelector(selectPolicyholderSelection);
  const selectedOpportunities = useSelector(selectSelectedOpportunities);
  const selectionLossModalRef = useRef<HTMLDivElement>(null);
  const [loadingModalitySummary, setLoadingModalitySummary] = useState(true);
  const [errorModalitySummary, setErrorModalitySummary] = useState(false);
  const [modalitiesSummaryData, setModalitiesSummaryData] =
    useState<ModalitiesSummaryDTO>();

  useEffect(() => {
    dispatch(fetchAccessToFeature(AccessFeatureEnum.LABOR_MODALITY));
  }, [dispatch]);

  useEffect(() => {
    const fetchModalitiesSummary = (federalIds: string[]) => {
      SummaryApi.getModalitiesSummary(federalIds)
        .then(response => {
          setModalitiesSummaryData(response);
          const { totalsModalities } = response;
          // If there is no active Labor opportunities but has active fiscal, select fiscal tab by default
          if (
            totalsModalities.some(
              t =>
                t.modality === ModalityEnum.LABOR && t.totalOpportunities === 0,
            ) &&
            totalsModalities.some(
              t =>
                t.modality === ModalityEnum.FISCAL && t.totalOpportunities > 0,
            )
          ) {
            dispatch(
              modalitySelectionSliceActions.setSelectedModality(
                ModalityEnum.FISCAL,
              ),
            );
          }
        })
        .catch(() => setErrorModalitySummary(true))
        .finally(() => setLoadingModalitySummary(false));
    };
    setLoadingModalitySummary(true);
    fetchModalitiesSummary(filteredPolicyholders);
  }, [filteredPolicyholders, dispatch]);

  const handleModalityTabSelection = (selectedTab: string) => {
    const selectedEnum = selectedTab as ModalityEnum;
    const action = () => {
      dispatch(modalitySelectionSliceActions.setSelectedModality(selectedEnum));
      TagManager.dataLayer({
        dataLayer: {
          event: 'SelectDashboardModalityTab',
          modalityId: MODALITIES_IDS[selectedEnum],
        },
      });
    };
    return selectedOpportunities.length > 0
      ? renderOpportunitySelectionLossModal(
          selectionLossModalRef.current,
          action,
        )
      : action();
  };

  const getDataToRender = (modality: ModalityEnum) => {
    return (
      modalitiesSummaryData?.totalsModalities.find(
        data => data.modality === modality,
      ) || {
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
      (modality === ModalityEnum.LABOR && hasAccessToLaborModality === null)
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
          {!loadingModalitySummary && (
            <>
              {getDataToRender(modality).totalOpportunities > 0 && (
                <ModalitySummaryCharts modality={modality} />
              )}
              <OpportunityDetailsList
                modality={modality}
                multipleSelection={modality === ModalityEnum.LABOR}
              />
            </>
          )}
        </>
      );
    if (
      modality === ModalityEnum.LABOR &&
      hasAccessToLaborModality !== null &&
      !hasAccessToLaborModality
    ) {
      content = () => <ModalityNotAvailable />;
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
      <DashboardSummary
        totalOpportunities={
          loadingModalitySummary
            ? undefined
            : modalitiesSummaryData?.totalOpportunities ?? 0
        }
        totalInsuredAmount={
          loadingModalitySummary
            ? undefined
            : modalitiesSummaryData?.totalInsuredAmount ?? 0
        }
        errorModalitySummary={errorModalitySummary}
      />
      <h2 className={styles['dashboard-container__modalities-title']}>
        Oportunidades por modalidade
      </h2>
      <div className={styles['dashboard-container__tabs-wrapper']}>
        <Tabs
          activeTab={selectedModality || 'labor'}
          onSelectTab={value => handleModalityTabSelection(value)}
          withDivider
        >
          {renderModalityTab(ModalityEnum.LABOR)}
          {renderModalityTab(ModalityEnum.FISCAL)}
          {renderModalityTab(ModalityEnum.CIVIL)}
        </Tabs>
      </div>
      <div ref={selectionLossModalRef} />
    </div>
  );
}

export default DashboardContainer;
