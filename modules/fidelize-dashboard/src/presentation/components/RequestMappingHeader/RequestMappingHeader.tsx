import styles from './RequestMappingHeader.module.scss';

const RequestMappingHeader = () => {
  return (
    <h1 className={styles['request-mapping-header__title']}>
      Nova solicitação de mapeamento
    </h1>
  );
};

export default RequestMappingHeader;
