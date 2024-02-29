import { FunctionComponent, useMemo } from 'react';
import { getYear } from 'date-fns';
import { Alert, Skeleton } from 'junto-design-system';
import { motion } from 'framer-motion';
import { ProfileEnum } from '@services';
import styles from './IncentiveTrailSummary.module.scss';

interface IncentiveTrailSummaryProps {
  dateStart?: string | null;
  accumulatedValue?: string;
  isAccept: boolean;
  onToogleAcceptModal: () => void;
  loading: boolean;
  profile: ProfileEnum | null;
}

const IncentiveTrailSummary: FunctionComponent<IncentiveTrailSummaryProps> = ({
  dateStart,
  accumulatedValue,
  isAccept,
  onToogleAcceptModal,
  loading,
  profile,
}) => {
  const campaignYear = useMemo(
    () => (dateStart ? getYear(new Date(dateStart)) : ''),
    [dateStart],
  );

  const renderAcceptAlert = () => {
    if (isAccept || profile !== ProfileEnum.BROKER) return null;
    return (
      <Alert
        text="Atenção, seus resultados ainda não estão sendo contabilizados! %ACTION_BUTTON% e aceite os termos do regulamento para participar."
        variant="warning"
        actionButtonText="Clique aqui"
        icon="alert-triangle"
        onActionButtonClick={onToogleAcceptModal}
      />
    );
  };

  const renderAmount = () => {
    if (loading) return <Skeleton height={38} width={150.64} />;
    return (
      <motion.div
        initial={{ opacity: 0, translateX: 25 }}
        whileInView={{ opacity: 1, translateX: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        {accumulatedValue}
      </motion.div>
    );
  };

  return (
    <article className={styles['incentive-trail-summary__wrapper']}>
      <h1 className={styles['incentive-trail-summary__title']}>
        Resultado parcial de {campaignYear}
      </h1>
      <p className={styles['incentive-trail-summary__total-amount']}>
        <span>Produção atual*</span>
        {renderAmount()}
      </p>
      {renderAcceptAlert()}
    </article>
  );
};

export default IncentiveTrailSummary;
