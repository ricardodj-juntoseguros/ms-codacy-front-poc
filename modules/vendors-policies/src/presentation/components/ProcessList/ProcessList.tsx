import { useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid/non-secure';
import {
  Pagination,
  Skeleton,
  ThemeContext,
  makeToast,
} from 'junto-design-system';
import { VendorsAuthService } from '@services';
import { stringToInt } from '@shared/utils';
import { ProposalListDTO } from '../../../application/types/dto';
import { ProcessListFilterParams } from '../../../application/types/model';
import ProcessListingApi from '../../../application/features/processListing/ProcessListingApi';
import EmptyProcessList from '../EmptyProcessList';
import ProcessListCard from '../ProcessListCard';
import UnavailableProcessList from '../UnavailableProcessList';
import { ProcessListCardSkeleton } from '../Skeletons';
import ProcessListFilters from '../ProcessListFilters';
import styles from './ProcessList.module.scss';

const ProcessList: React.FC = () => {
  const theme = useContext(ThemeContext);
  const [activePage, setActivePage] = useState<number>(1);
  const [loadingProcesses, setLoadingProcesses] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [otherParams, setOtherParams] = useState<ProcessListFilterParams>({});
  const [proposals, setProposals] = useState<ProposalListDTO>();

  useEffect(() => {
    fetchProposals(activePage, otherParams);
  }, [activePage, otherParams]);

  const hasAppliedAFilter = useMemo(
    () => Object.values(otherParams).length !== 0,
    [otherParams],
  );

  const fetchProposals = (
    pageNumber: number,
    otherParams: ProcessListFilterParams,
  ) => {
    setLoadingProcesses(true);
    const { identification, status, insuredFederalId, policyholderFederalId } =
      otherParams;
    ProcessListingApi.getProcesses(
      pageNumber,
      10,
      identification,
      status,
      insuredFederalId,
      policyholderFederalId,
    )
      .then(response => {
        setError(false);
        setProposals(response);
      })
      .catch(error => {
        setError(true);
        if (error.data && error.data.data) {
          makeToast('error', error.data.data);
        }
      })
      .finally(() => setLoadingProcesses(false));
  };

  const renderSkeleton = () => {
    if (!loadingProcesses) return null;
    return Array.from({ length: 5 }, () => (
      <ProcessListCardSkeleton key={nanoid(5)} />
    ));
  };

  const handleProcessFilterChange = (
    filterType: string,
    filterValue: string | null,
  ) => {
    setActivePage(1);
    if (filterValue === null) {
      setOtherParams({});
      return;
    }
    switch (filterType) {
      case 'process':
        setOtherParams({ identification: filterValue });
        break;
      case 'status':
        if (filterValue === '-1') {
          setOtherParams({});
          break;
        }
        setOtherParams({ status: stringToInt(filterValue) });
        break;
      case 'insured':
        setOtherParams({ insuredFederalId: filterValue });
        break;
      case 'policyholder':
        setOtherParams({ policyholderFederalId: filterValue });
        break;
      default:
        setOtherParams({});
    }
  };

  const handleFilterTypeChange = () => {
    if (Object.keys(otherParams).length > 0) {
      setOtherParams({});
    }
  };

  return (
    <div className={styles['process-list__wrapper']}>
      <h2 className={classNames(styles[theme], styles['process-list__title'])}>
        Lista de processos
      </h2>
      <p
        className={classNames(styles[theme], styles['process-list__subtitle'])}
      >
        Analise e acompanhe os status de suas garantias já solicitadas.
      </p>
      <ProcessListFilters
        isLoadingProcesses={loadingProcesses}
        currentFilters={otherParams}
        onChangeFilterValueCallback={handleProcessFilterChange}
        onChangeFilterTypeCallback={handleFilterTypeChange}
      />
      <div className={styles['process-list__totalizer']}>
        {loadingProcesses ? (
          <Skeleton width={136} height={8} />
        ) : (
          <>
            <p className={styles[theme]}>
              {proposals ? proposals.totalCount : 0}
              {hasAppliedAFilter
                ? ' processos encontrados para sua busca.'
                : ' processos listados.'}
            </p>
          </>
        )}
      </div>
      <div className={styles['process-list__list-container']}>
        {renderSkeleton()}
        {!loadingProcesses &&
          proposals &&
          proposals.data.map(proposal => (
            <ProcessListCard
              key={`proposal-card-${proposal.identification.proposalId}`}
              proposal={proposal}
            />
          ))}
        {!loadingProcesses && proposals && proposals.totalCount === 0 && (
          <EmptyProcessList
            hasAppliedFilter={hasAppliedAFilter}
            userType={VendorsAuthService.getUserType()}
          />
        )}
        {!loadingProcesses && (!proposals || error) && (
          <UnavailableProcessList />
        )}
      </div>
      {proposals && proposals.totalCount > 10 && (
        <div className={styles['process-list__paging']}>
          <Pagination
            activePage={activePage}
            itemsPerPage={10}
            totalItemsCount={proposals ? proposals.totalCount : 0}
            onChange={page => setActivePage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ProcessList;
