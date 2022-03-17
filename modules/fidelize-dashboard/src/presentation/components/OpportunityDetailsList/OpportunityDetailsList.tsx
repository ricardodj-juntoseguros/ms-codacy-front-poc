import { useEffect, useState } from 'react';
import { Divider, Skeleton } from 'junto-design-system';
import { nanoid } from 'nanoid';
import OpportunityDetailsListHeader from '../OpportunityDetailsListHeader';
import OpportunityDetailsListItem from '../OpportunityDetailsListItem';
import { OpportunityDetailsListItemSkeleton } from '../Skeletons';
import { ModalityEnum } from '../../../application/types/model';
import { getLabelByModality } from '../../../helpers';
import styles from './OpportunityDetailsList.module.scss';

// temporary mock data
const data = [
  {
    type: { id: 1, description: 'Renovação' },
    expiration: '2022-04-16T00:00:00.000Z',
    securityAmount: 2138210,
    policyholder: 'Lavínia e Tereza Contábil Ltda',
    mappingDate: '2022-01-16T13:45:43.000Z',
  },
  {
    type: { id: 1, description: 'Renovação' },
    expiration: '2022-06-06T00:00:00.000Z',
    securityAmount: 902138210,
    policyholder: 'Vinicius e Benjamin Vidros ME',
    mappingDate: '2022-01-16T13:45:43.000Z',
  },
  {
    type: { id: 1, description: 'Renovação' },
    expiration: '2022-03-25T00:00:00.000Z',
    securityAmount: 21130510,
    policyholder: 'Bruna e Silvana Esportes Radicais LTDA',
    mappingDate: '2022-01-16T13:45:43.000Z',
  },
  {
    type: { id: 1, description: 'Renovação' },
    expiration: '2022-10-12T00:00:00.000Z',
    securityAmount: 630962,
    policyholder: 'Regina e Nicole Joalheria Ltda',
    mappingDate: '2021-12-22T13:45:43.000Z',
  },
  {
    type: { id: 1, description: 'Renovação' },
    expiration: '2022-03-22T00:00:00.000Z',
    securityAmount: 920054,
    policyholder: 'Rosa Construções Ltda',
    mappingDate: '2022-02-01T13:45:43.000Z',
  },
  {
    type: { id: 1, description: 'Renovação' },
    expiration: '2022-04-16T00:00:00.000Z',
    securityAmount: 2138210,
    policyholder: 'Lavínia e Tereza Contábil Ltda',
    mappingDate: '2022-01-16T13:45:43.000Z',
  },
  {
    type: { id: 1, description: 'Renovação' },
    expiration: '2022-06-06T00:00:00.000Z',
    securityAmount: 902138210,
    policyholder: 'Vinicius e Benjamin Vidros ME',
    mappingDate: '2022-01-16T13:45:43.000Z',
  },
  {
    type: { id: 1, description: 'Renovação' },
    expiration: '2022-03-25T00:00:00.000Z',
    securityAmount: 21130510,
    policyholder: 'Bruna e Silvana Esportes Radicais LTDA',
    mappingDate: '2022-01-16T13:45:43.000Z',
  },
  {
    type: { id: 1, description: 'Renovação' },
    expiration: '2022-10-12T00:00:00.000Z',
    securityAmount: 630962,
    policyholder: 'Regina e Nicole Joalheria Ltda',
    mappingDate: '2021-12-22T13:45:43.000Z',
  },
  {
    type: { id: 1, description: 'Renovação' },
    expiration: '2022-02-22T00:00:00.000Z',
    securityAmount: 920054,
    policyholder: 'Rosa Construções Ltda',
    mappingDate: '2022-02-01T13:45:43.000Z',
  },
];

interface OpportunityDetailsListProps {
  modality: ModalityEnum;
}

const OpportunityDetailsList: React.FC<OpportunityDetailsListProps> = ({
  modality,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  });

  const renderListItems = () => {
    if (loading) {
      return Array.from({ length: 10 }, () => (
        <OpportunityDetailsListItemSkeleton key={nanoid(5)} />
      ));
    }
    return data.map(opportunity => {
      const { type, expiration, mappingDate, policyholder, securityAmount } =
        opportunity;
      return (
        <OpportunityDetailsListItem
          key={`opportunity-details-listitem-${nanoid(5)}`}
          type={type.description}
          expiration={expiration}
          securityAmount={securityAmount}
          policyholder={policyholder}
          mappingDate={mappingDate}
        />
      );
    });
  };

  return (
    <div className={styles['opportunity-details-list__wrapper']}>
      <h3 className={styles['opportunity-details-list__title']}>
        Detalhes das oportunidades {getLabelByModality(modality, '', true)}
      </h3>
      <div className={styles['opportunity-details-list__box']}>
        <p className={styles['opportunity-details-list__total-label']}>
          {loading ? (
            <Skeleton width={250} height={8} />
          ) : (
            '7.852 oportunidades listadas, incluindo expiradas'
          )}
        </p>
        <Divider />
        <div className={styles['opportunity-details-list__list-container']}>
          <OpportunityDetailsListHeader />
          {renderListItems()}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailsList;
