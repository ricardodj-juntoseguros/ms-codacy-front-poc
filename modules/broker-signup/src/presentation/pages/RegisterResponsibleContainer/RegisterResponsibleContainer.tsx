import { RouteComponentProps } from 'react-router';
import { LinkButton } from 'junto-design-system';
import styles from './RegisterResponsibleContainer.module.scss';
import { ReactComponent as LogoJunto } from '../../assets/logoJunto.svg';
import ResponsibleInformation from '../../components/ResponsibleInformation';


const RegisterResponsibleContainer= ({ history }: RouteComponentProps) => {
  const sreenWidth = window.screen.width;

  const handleGoBackClick = () => {
    history.push('/');
  };

  return (
    <div className={styles['register_responsible_container__wrapper']}>
      <div className={styles['register_responsible_container__illustration']}>
          <LinkButton
            data-testid="go-back-btn"
            onClick={() => handleGoBackClick()}
            label={sreenWidth > 680 ? 'VOLTAR' : '' }
            icon="arrow-left"
            />
          <LogoJunto />
      </div>
      <div className={styles['register_responsible_container__title']}><span>Para começar, precisamos de alguns dados do responsável da corretora</span></div>
      <ResponsibleInformation/>
    </div>
  );
}

export default RegisterResponsibleContainer;
