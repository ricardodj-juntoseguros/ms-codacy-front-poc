import { RouteComponentProps } from 'react-router';
import UploaderFile from '../../components/UploaderFile';
import styles from './ImportContainer.module.scss';

function ImportContainer({ history }: RouteComponentProps) {
  const goToHome = () => {
    history.push('/');
  };
  return (
    <div className={styles['import-file__container']}>
      <div className={styles['import-file__wrapper']}>
        <div className={styles['import-file__scrumbs']}>
          <button
            type="button"
            data-testid="go-to-home"
            className={styles['import-file__scrumbs--active']}
            onClick={() => goToHome()}
          >
            Página inicial
          </button>
          <span className={styles['import-file__scrumbs--actual']}>
            Nova solicitação
          </span>
        </div>
        <h3>Nova solicitação</h3>
        <p>
          Para realizar uma nova solicitação, importe a planilha Excel com os
          dados dos tomadores que deseja solicitar mapeamento. Caso tenha alguma
          dúvida sobre o padrão da planilha, baixe o modelo disponível nesta
          página.
        </p>
        <UploaderFile />
      </div>
    </div>
  );
}

export default ImportContainer;
