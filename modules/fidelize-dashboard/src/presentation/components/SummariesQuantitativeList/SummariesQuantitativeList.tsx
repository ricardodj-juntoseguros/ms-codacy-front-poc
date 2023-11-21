import { nanoid } from 'nanoid/non-secure';

import { SummariesQuantitativeByPolicyholderDTO } from '../../../application/types/dto/SummariesQuantitativeByPolicyholderDTO';
import styles from './SummariesQuantitativeList.module.scss';
import SummariesQuantitativeListHeader from '../SummariesQuantitativeListHeader';
import SummariesQuantitativeListitem from '../SummariesQuantitativeListitem';

interface SummariesQuantitativeListProps {
  summaries: SummariesQuantitativeByPolicyholderDTO[];
  loading: boolean;
}

const SummariesQuantitativeList: React.FC<SummariesQuantitativeListProps> = ({
  summaries,
  loading,
}) => {
  const renderListItems = () => {
    return (
      <>
        <div className={styles['summaries-quantitative-list__items']}>
          {summaries.length > 0 &&
            summaries.map(summary => (
              <SummariesQuantitativeListitem
                key={nanoid(5)}
                summariesQuantitative={summary}
              />
            ))}
        </div>
      </>
    );
  };
  return (
    <div
      className={styles['summaries-quantitative-list__wrapper']}
      data-testid="summaries-quantitative-list"
    >
      <SummariesQuantitativeListHeader />
      {renderListItems()}
      <div className={styles['summaries-quantitative__footer']}>
        A quantidade apresentada de processos é uma estimativa, com base na
        localização de termos extraídos da Razão Social em publicações judiciais
        e não representa, em hipótese alguma, a confirmação da totalidade de
        processos existentes para o CNPJ pesquisado. Pode haver variações para
        mais ou para menos, advindas de grafias incorretas e coincidências na
        Razão Social do CNPJ, ou mesmo a existência de processo onde o CNPJ
        tenha sido mencionado. A Junto Seguros não se responsabiliza pela
        exatidão e uso das informaçes apresentadas.
      </div>
    </div>
  );
};

export default SummariesQuantitativeList;
