import { FilesCircleIllustration } from '@shared/ui';
import { MappingStatusEnum } from '../../../application/types/model';
import styles from './EmptyRequestsListing.module.scss';

interface EmptyRequestsListingProps {
  mappingStatus: MappingStatusEnum;
}

const EmptyRequestsListing: React.FC<EmptyRequestsListingProps> = ({
  mappingStatus,
}) => {
  const getTitle = () => {
    switch (mappingStatus) {
      case MappingStatusEnum.ON_QUEUE:
        return 'Não há registros de solicitações';
      case MappingStatusEnum.BLOCKED:
        return 'Não há registros de bloqueios';
      case MappingStatusEnum.DONE:
        return 'Não há solicitações concluídas';
      default:
        return '';
    }
  };

  const getText = () => {
    switch (mappingStatus) {
      case MappingStatusEnum.ON_QUEUE:
        return 'Faça uma nova solicitação de mapeamento de um tomador. O mesmo será enviado para a fila de mapeamento e apresentado aqui.';
      case MappingStatusEnum.BLOCKED:
        return 'Até o momento não há solicitações bloqueadas. Quando isso ocorrer os tomadores e motivos de bloqueio serão apresentados aqui.';
      case MappingStatusEnum.DONE:
        return 'Até o momento não encontramos solicitações de mapeamentos concluídas. Quando isso ocorrer serão apresentadas aqui.';
      default:
        return '';
    }
  };

  return (
    <div className={styles['empty-requests-listing__wrapper']}>
      <FilesCircleIllustration />
      <h2 className={styles['empty-requests-listing__title']}>{getTitle()}</h2>
      <p className={styles['empty-requests-listing__text']}>{getText()}</p>
    </div>
  );
};

export default EmptyRequestsListing;
