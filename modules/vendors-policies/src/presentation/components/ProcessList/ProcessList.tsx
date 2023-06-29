import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid/non-secure';
import {
  Pagination,
  Skeleton,
  ThemeContext,
  makeToast,
} from 'junto-design-system';
import { VendorsAuthService } from '@services';
import { ProposalListDTO } from '../../../application/types/dto';
import ProcessListingApi from '../../../application/features/processListing/ProcessListingApi';
import styles from './ProcessList.module.scss';
import EmptyProcessList from '../EmptyProcessList';
import ProcessListCard from '../ProcessListCard';
import UnavailableProcessList from '../UnavailableProcessList';
import { ProcessListCardSkeleton } from '../Skeletons';

const ProcessList: React.FC = () => {
  const theme = useContext(ThemeContext);
  const [activePage, setActivePage] = useState<number>(1);
  const [loadingProcesses, setLoadingProcesses] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [proposals, setProposals] = useState<ProposalListDTO>();

  useEffect(() => {
    fetchProposals(activePage);
  }, [activePage]);

  const fetchProposals = (pageNumber: number) => {
    if (VendorsAuthService.getUserType() !== 'insured') {
      setLoadingProcesses(false);
      return;
    }
    setLoadingProcesses(true);
    ProcessListingApi.getProcesses(pageNumber, 10)
      .then(response => {
        setError(false);
        setProposals(response);
      })
      .catch(error => {
        console.log(error);
        setError(true);
        if (error.data && error.data.data) {
          makeToast('error', error.data.data.message);
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
      <div className={styles['process-list__totalizer']}>
        {loadingProcesses ? (
          <Skeleton width={136} height={8} />
        ) : (
          <p className={styles[theme]}>
            {proposals ? proposals.totalCount : 0} processos listados
          </p>
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
          <EmptyProcessList />
        )}
        {!loadingProcesses && (!proposals || error) && (
          <UnavailableProcessList
            hasError={VendorsAuthService.getUserType() === 'insured'}
          />
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
