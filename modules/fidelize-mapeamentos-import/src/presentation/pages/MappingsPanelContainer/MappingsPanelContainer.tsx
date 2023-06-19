import { RouteComponentProps } from 'react-router';
import {
  Tabs,
  Tab,
  Button,
  ToastContainer,
  makeToast,
} from 'junto-design-system';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ListingMappingApi from '../../../application/features/listingMapping/ListingMappingApi';
import { MappingStatusEnum } from '../../../application/types/model/MappingStatusEnum';
import styles from './MappingsPanelContainer.module.scss';
import MappingRequests from '../../components/MappingRequests';
import { MappingSummaryDTO } from '../../../application/types/dto';
import { renderMappingEditionLossModal } from '../../../helpers/renderMappingEditionLossModal';
import {
  selectModalEdition,
  setEditorId,
} from '../../../application/features/modalMapping/ModalMappingSlice';

function MappingsPanelContainer({ history }: RouteComponentProps) {
  const [summary, setSummary] = useState<MappingSummaryDTO[]>([]);
  const [activeTab, setActiveTab] = useState<string>(
    MappingStatusEnum.ON_QUEUE,
  );
  const editionLossModalRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { editorId } = useSelector(selectModalEdition);
  const goToSolicitation = () => {
    editorId === 0
      ? history.push('/solicitar')
      : renderMappingEditionLossModal(
          editionLossModalRef.current,
          () => {
            dispatch(setEditorId([0]));
            history.push('/solicitar');
          },
          true,
        );
  };

  useEffect(() => {
    fetchMappingSummary();
    dispatch(setEditorId([0]));
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
    const content = () => (
      <MappingRequests
        mappingStatus={status}
        onChangeCallback={() => fetchMappingSummary()}
      />
    );

    summary.length > 0
      ? (itemStatus = summary.find(item => item.status === status))
      : '';

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
            onSelectTab={tab =>
              editorId === 0
                ? setActiveTab(tab)
                : renderMappingEditionLossModal(
                    editionLossModalRef.current,
                    () => {
                      dispatch(setEditorId([0]));
                      setActiveTab(tab);
                    },
                    true,
                  )
            }
            withDivider={false}
          >
            {renderMappingsStatus('Na fila', MappingStatusEnum.ON_QUEUE)}
            {renderMappingsStatus('Para análise', MappingStatusEnum.BLOCKED)}
            {renderMappingsStatus('Concluídos', MappingStatusEnum.DONE)}
          </Tabs>
        </div>
      </div>
      <ToastContainer duration={2000} />
      <div ref={editionLossModalRef} />
    </div>
  );
}

export default MappingsPanelContainer;
