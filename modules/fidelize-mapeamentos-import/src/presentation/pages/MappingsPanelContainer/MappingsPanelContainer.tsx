import { RouteComponentProps } from 'react-router';
import {
  Tabs,
  Tab,
  Button,
  ToastContainer,
  makeToast,
} from 'junto-design-system';
import { useEffect, useState } from 'react';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import { MappingStatusEnum } from '../../../application/types/model/MappingStatusEnum';
import styles from './MappingsPanelContainer.module.scss';
import ListingUnderConstruction from '../../components/ListingUnderConstruction/ListingUnderConstruction';
import MappingRequests from '../../components/MappingRequests';
import { MappingSummaryDTO } from '../../../application/types/dto';

function MappingsPanelContainer({ history }: RouteComponentProps) {
  const [summary, setSummary] = useState<MappingSummaryDTO[]>([]);
  const [activeTab, setActiveTab] = useState<string>(
    MappingStatusEnum.ON_QUEUE,
  );

  const goToSolicitation = () => {
    history.push('/solicitar');
  };

  useEffect(() => {
    fetchMappingSummary();
  }, []);

  const fetchMappingSummary = () => {
    new ListingMappingApi()
      .getMappingSummary()
      .then(response => {
        setSummary(response);
      })
      .catch(() => {
        makeToast(
          'warning',
          'Alguns dados não estão disponíveis no momento. Tente novamente mais tarde.',
        );
      });
  };

  const renderMappingsStatus = (label: string, status: MappingStatusEnum) => {
    let itemStatus: any;
    let content = () => (
      <MappingRequests
        mappingStatus={status}
        onRemoveCallback={() => fetchMappingSummary()}
      />
    );
    if (status === MappingStatusEnum.BLOCKED) {
      content = () => <ListingUnderConstruction />;
    }

    if (summary.length > 0) {
      itemStatus = summary.find(item => item.status === status);
    }

    return (
      <Tab
        value={status}
        label={label}
        totalizer={itemStatus ? itemStatus.total : 0}
      >
        {content()}
      </Tab>
    );
  };

  return (
    <div className={styles['mappings-panel__container']}>
      <div className={styles['mappings-panel__wrapper']}>
        <div className={styles['mappings-panel__header-wrapper']}>
          <h3>Olá, acompanhe as solicitações de mapeamento do Fidelize</h3>
          <Button
            data-testid="btn-goto-solicitation"
            size="medium"
            onClick={() => {
              goToSolicitation();
            }}
          >
            Nova solicitação
          </Button>
        </div>
        <div className={styles['mappings-panel__tabs-wrapper']}>
          <Tabs
            activeTab={activeTab}
            onSelectTab={tab => setActiveTab(tab)}
            withDivider={false}
          >
            {renderMappingsStatus('Na fila', MappingStatusEnum.ON_QUEUE)}
            {renderMappingsStatus('Bloqueados', MappingStatusEnum.BLOCKED)}
            {renderMappingsStatus('Concluídos', MappingStatusEnum.DONE)}
          </Tabs>
        </div>
      </div>
      <ToastContainer duration={2000} />
    </div>
  );
}

export default MappingsPanelContainer;
