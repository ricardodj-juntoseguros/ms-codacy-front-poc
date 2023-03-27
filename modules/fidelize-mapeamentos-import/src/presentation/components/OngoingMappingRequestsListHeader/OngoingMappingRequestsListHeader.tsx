import styles from './OngoingMappingRequestsListHeader.module.scss';

const OngoingMappingRequestsListHeader: React.FC = () => {
  return (
    <div className={styles['ongoing-mapping-request-listheader__wrapper']}>
      <div>
        <span>Solicitado Em</span>
      </div>
      <div>
        <span>Tomador/Grupo</span>
      </div>
      <div>
        <span>Corretora/Categoria</span>
      </div>
      <div>
        <span>Trab.</span>
      </div>
      <div>
        <span>Fed.</span>
      </div>
      <div>
        <span>Est.</span>
      </div>
      <div>
        <span>CARF</span>
      </div>
      <div>
        <span>DA</span>
      </div>
      <div>
        <span>Status</span>
      </div>
    </div>
  );
};

export default OngoingMappingRequestsListHeader;
