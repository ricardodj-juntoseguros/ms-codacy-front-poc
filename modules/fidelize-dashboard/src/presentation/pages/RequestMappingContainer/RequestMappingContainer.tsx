import { useSelector } from 'react-redux';
import { summariesQuantitativeByPolicyholder } from '../../../application/features/summariesQuantitative/SummariesQuantitativeSlice';
import AllPolicyholdersInWalletFilterSelector from '../../components/AllPolicyholdersInWalletFilterSelector';
import RequestMappingHeader from '../../components/RequestMappingHeader';
import RequestMappingHelper from '../../components/RequestMappingHelper';
import styles from './RequestMappingContainer.module.scss';
import SummariesQuantitativeList from '../../components/SummariesQuantitativeList';

function RequestMappingContainer() {
  const summaries = useSelector(summariesQuantitativeByPolicyholder) || null;
  return (
    <div className={styles['request-mapping-container__wrapper']}>
      <RequestMappingHeader />
      <AllPolicyholdersInWalletFilterSelector />
      {summaries?.length === 0 && <RequestMappingHelper />}
      {summaries && summaries?.length > 0 && (
        <SummariesQuantitativeList summaries={summaries} loading />
      )}
    </div>
  );
}

export default RequestMappingContainer;
