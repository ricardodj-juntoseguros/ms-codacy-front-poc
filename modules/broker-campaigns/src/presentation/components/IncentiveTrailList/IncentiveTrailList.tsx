import { FunctionComponent, memo, useState } from 'react';
import { nanoid } from '@reduxjs/toolkit';
import { motion } from 'framer-motion';
import { IncentiveTrailStep } from '../../../application/types/model';
import IncentiveTrailCard from '../IncentiveTrailCard';
import styles from './IncentiveTrailList.module.scss';
import IncentiveTrailRedeemModal from '../IncentiveTrailRedeemModal';
import { IncentiveTrailListSkeleton } from '../Skeletons';

interface IncentiveTrailListProps {
  steps?: IncentiveTrailStep[];
  loading: boolean;
}

const IncentiveTrailList: FunctionComponent<IncentiveTrailListProps> = ({
  steps,
  loading,
}) => {
  const [toogleRedeemModal, setToogleRedeemModal] = useState(false);

  const handleToogleRedeemModal = () => {
    setToogleRedeemModal(!toogleRedeemModal);
  };

  return (
    <>
      {loading ? (
        <IncentiveTrailListSkeleton />
      ) : (
        <motion.div
          initial={{ opacity: 0, translateY: 50 }}
          whileInView={{ opacity: 1, translateY: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <ul className={styles['incentive-trail-list__wrapper']}>
            {steps?.map(step => (
              <IncentiveTrailCard
                onToggleModalRedeem={handleToogleRedeemModal}
                key={nanoid(8)}
                {...step}
              />
            ))}
          </ul>
        </motion.div>
      )}
      <IncentiveTrailRedeemModal
        toogleModal={toogleRedeemModal}
        onCloseModal={handleToogleRedeemModal}
      />
    </>
  );
};

export default memo(IncentiveTrailList);
