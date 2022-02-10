import { LinkButton } from 'junto-design-system';
import { RouteComponentProps } from 'react-router';
import styles from './NotFoundContainer.module.scss';

const NotFoundContainer = ({ history }: RouteComponentProps) => {
  const handleGoBackClick = () => {
    history.push('/dashboard');
  };

  return (
    <div className={styles['not-found-container__wrapper']}>
      <h1 className={styles['not-found-container__title']}>
        Ops! A página que você procura não existe.
      </h1>
      <LinkButton
        data-testid="go-back-btn"
        onClick={() => handleGoBackClick()}
        label="Voltar para o início"
        icon="arrow-left"
      />
    </div>
  );
};

export default NotFoundContainer;
