import { FlowProvider } from '@shared/hooks';
import * as ALL_STEPS from '../../../constants/modalitiesSteps';
import styles from './QuoteContainer.module.scss';

const QuoteContainer = () => {
  return (
    <div className={styles['quote-container__wrapper']}>
      <FlowProvider
        allSteps={Object.values(ALL_STEPS).flat()}
        initialSteps={ALL_STEPS.COMMON_STEP}
        showFinishedSteps={false}
      />
    </div>
  );
};
export default QuoteContainer;
