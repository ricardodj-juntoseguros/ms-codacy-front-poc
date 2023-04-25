import styles from './DoneMappingRequestsListHeader.module.scss';

const DoneMappingRequestsListHeader: React.FC = () => {
  return (
    <div className={styles['done-mapping-request-listheader__wrapper']}>
      <div>
        <span>Mapeado Em</span>
      </div>
      <div>
        <span>Tomador/Grupo</span>
      </div>
      <div>
        <span>Corretora/Categoria</span>
      </div>
      <div>
        <span>Total de Processos</span>
      </div>
      <div>
        <span>Processos Abertos</span>
      </div>
      <div>
        <span>Oportunidades</span>
      </div>
    </div>
  );
};

export default DoneMappingRequestsListHeader;
