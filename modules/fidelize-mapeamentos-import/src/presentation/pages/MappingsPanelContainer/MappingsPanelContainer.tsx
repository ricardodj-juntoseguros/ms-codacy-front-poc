import { RouteComponentProps } from 'react-router';
import { Tabs, Tab, Button } from 'junto-design-system';
import { useEffect, useState } from 'react';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import { MappingStatusEnum } from '../../../application/types/model/MappingStatusEnum';
import styles from './MappingsPanelContainer.module.scss';
import ListingUnderConstruction from '../../components/ListingUnderConstruction/ListingUnderConstruction';
import MappingRequests from '../../components/MappingRequests';

function MappingsPanelContainer({ history }: RouteComponentProps) {
  const [activeTab, setActiveTab] = useState<string>(
    MappingStatusEnum.ON_QUEUE,
  );
  const goToSolicitation = () => {
    history.push('/solicitar');
  };

  const fetchListngMapping = () => {
    new ListingMappingApi().getListingMapping(1, 10, 'BLOCKED');
  };

  const fetchMappingSummary = () => {
    new ListingMappingApi().getMappingSummary();
  };

  useEffect(() => {
    fetchListngMapping();
    fetchMappingSummary();
  }, []);

  const renderMappingsStatus = (label: string, status: MappingStatusEnum) => {
    let content = () => <MappingRequests mappingStatus={status} />;
    if (status !== MappingStatusEnum.ON_QUEUE) {
      content = () => <ListingUnderConstruction />;
    }

    return (
      <Tab value={status} label={label} totalizer={null}>
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
    </div>
  );
}

export default MappingsPanelContainer;
