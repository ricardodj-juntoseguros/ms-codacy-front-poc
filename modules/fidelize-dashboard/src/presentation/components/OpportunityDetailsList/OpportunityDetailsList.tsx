import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import TagManager from 'react-gtm-module';
import { Divider, Skeleton, ToastContainer } from 'junto-design-system';
import { nanoid } from 'nanoid';
import { thousandSeparator } from '@shared/utils';
import { NotFoundIllustration } from '@shared/ui';
import OpportunityDetailsListHeader from '../OpportunityDetailsListHeader';
import OpportunityDetailsListItem from '../OpportunityDetailsListItem';
import OpportunityDetailsListPaging from '../OpportunityDetailsListPaging';
import OpportunityDetailsListFooter from '../OpportunityDetailsListFooter';
import OpportunityDetailsListFilters from '../OpportunityDetailsListFilters';
import OpportunityDetailsModal from '../OpportunityDetailsModal';
import { OpportunityDetailsListItemSkeleton } from '../Skeletons';
import {
  ModalityEnum,
  OpportunityDetailsOrderEnum,
} from '../../../application/types/model';
import { OpportunityDetailsItemDTO } from '../../../application/types/dto';
import {
  selectSettingsByModality,
  selectSelectedOpportunities,
} from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsSlice';
import OpportunitiesDetailsApi from '../../../application/features/opportunitiesDetails/OpportunitiesDetailsApi';
import { selectPolicyholderSelection } from '../../../application/features/policyholderFilter/PolicyholderFilterSlice';
import { getLabelByModality, hasAppliedAnyFilter } from '../../../helpers';
import styles from './OpportunityDetailsList.module.scss';

interface OpportunityDetailsListProps {
  modality: ModalityEnum;
  multipleSelection: boolean;
}

const OpportunityDetailsList: React.FC<OpportunityDetailsListProps> = ({
  modality,
  multipleSelection,
}) => {
  const { activePage, pageSize, orderBy, direction, filters } = useSelector(
    selectSettingsByModality(modality),
  ) || {
    activePage: 1,
    pageSize: 10,
    modality,
    orderBy: OpportunityDetailsOrderEnum.RELEVANCE,
    direction: 'desc',
  };
  const filteredPolicyholders = useSelector(selectPolicyholderSelection);
  const selectedOpportunities = useSelector(selectSelectedOpportunities);
  const listItemsContainerRef = useRef<HTMLDivElement>(null);
  const [loadingItems, setLoadingItems] = useState(true);
  const [data, setData] = useState<OpportunityDetailsItemDTO[]>();
  const [interestedOpportunity, setInterestedOpportunity] =
    useState<OpportunityDetailsItemDTO>();
  const [totalCount, setTotalCount] = useState<number>();
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchOpportunityDetails = () => {
      OpportunitiesDetailsApi.getOpportunitiesDetailsByModality(
        modality,
        activePage,
        pageSize,
        orderBy,
        direction,
        filteredPolicyholders,
        filters,
      )
        .then(response => {
          setData(response.data);
          setTotalCount(response.totalCount);
        })
        .catch(() => setError(true))
        .finally(() => setLoadingItems(false));
    };

    setError(false);
    setLoadingItems(true);
    fetchOpportunityDetails();
  }, [
    activePage,
    pageSize,
    modality,
    orderBy,
    direction,
    filteredPolicyholders,
    filters,
  ]);

  useEffect(() => {
    setTotalCount(undefined);
  }, [modality, filteredPolicyholders, filters]);

  const handleClickMoreDetailsItem = (
    opportunity: OpportunityDetailsItemDTO,
  ) => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'ClickMoreOpportunityDetailsButton',
        opportunityId: opportunity.id,
        opportunityCount: 1,
      },
    });
    setInterestedOpportunity(opportunity);
    setModalOpen(true);
  };

  const handleClickMoreDetailsFooter = () => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'ClickMoreOpportunityDetailsButton',
        opportunityId: undefined,
        opportunityCount: selectedOpportunities.length,
      },
    });
    setInterestedOpportunity(undefined);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setInterestedOpportunity(undefined);
  };

  const renderEmptyListFeedback = () => {
    if (filters && hasAppliedAnyFilter(filters)) {
      return (
        <div
          className={styles['opportunity-details-list__no-filtered-results']}
        >
          <NotFoundIllustration />
          <h3>Não encontramos oportunidades para o seu filtro.</h3>
          <p>
            Tente usar outros parâmetros e filtre novamente. Caso tenha alguma
            dúvida, seu comercial está sempre disponível para te ajudar.
          </p>
        </div>
      );
    }
    return (
      <div className={styles['opportunity-details-list__no-results']}>
        <p>Nenhuma oportunidade encontrada.</p>
      </div>
    );
  };

  const renderListItems = () => {
    if (loadingItems || !data) {
      return Array.from({ length: pageSize }, () => (
        <OpportunityDetailsListItemSkeleton key={nanoid(5)} />
      ));
    }
    if (data.length === 0) {
      return renderEmptyListFeedback();
    }
    return data.map(opportunity => {
      return (
        <OpportunityDetailsListItem
          checkable={multipleSelection}
          key={`opportunity-details-listitem-${nanoid(5)}`}
          opportunity={opportunity}
          onMoreDetailsClick={handleClickMoreDetailsItem}
        />
      );
    });
  };

  return (
    <div className={styles['opportunity-details-list__wrapper']}>
      <div className={styles['opportunity-details-list-title-wrapper']}>
        <h3 className={styles['opportunity-details-list__title']}>
          Detalhes das oportunidades {getLabelByModality(modality, '', true)}
        </h3>
      </div>
      {process.env.NX_FID_FEATURE_OPPORTUNITY_FILTERS === 'true' && (
        <OpportunityDetailsListFilters modality={modality} />
      )}
      <div className={styles['opportunity-details-list__box']}>
        {error ? (
          <div className={styles['opportunity-details-list__error']}>
            Ocorreu um erro inesperado ao consultar as oportunidades.
          </div>
        ) : (
          <>
            <p className={styles['opportunity-details-list__total-label']}>
              {totalCount !== undefined ? (
                `${thousandSeparator(
                  totalCount,
                )} oportunidades listadas, incluindo expiradas`
              ) : (
                <Skeleton width={250} height={8} />
              )}
            </p>
            <Divider />
            <div className={styles['opportunity-details-list__list-container']}>
              <OpportunityDetailsListHeader modality={modality} />
              <div ref={listItemsContainerRef}>{renderListItems()}</div>
            </div>
          </>
        )}
      </div>
      {multipleSelection && selectedOpportunities.length > 0 && (
        <OpportunityDetailsListFooter
          listContainerRef={listItemsContainerRef}
          selectedOpportunities={selectedOpportunities}
          onMoreDetailsClick={handleClickMoreDetailsFooter}
        />
      )}
      {totalCount !== undefined && totalCount > 10 && (
        <OpportunityDetailsListPaging
          totalCount={totalCount}
          modality={modality}
        />
      )}
      <OpportunityDetailsModal
        isOpen={modalOpen}
        modality={modality}
        opportunity={interestedOpportunity}
        onModalClose={handleModalClose}
      />
      <ToastContainer />
    </div>
  );
};

export default OpportunityDetailsList;
