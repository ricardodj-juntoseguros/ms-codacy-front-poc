import { FunctionComponent } from 'react';
import { DISCLAIMERS } from '../../../constants';
import styles from './ResolutionCNSP382.module.scss';

const ResolutionCNSP382: FunctionComponent = () => {
  return (
    <div className={styles['resolution-cnsp382__wrapper']}>
      <h3 className={styles['resolution-cnsp382__title']}>
        <i className="icon icon-alert-circle" />
        Importante
      </h3>
      <p className={styles['resolution-cnsp382__content']}>
        {DISCLAIMERS.resolutionCNSP382}
      </p>
    </div>
  );
};

export default ResolutionCNSP382;
