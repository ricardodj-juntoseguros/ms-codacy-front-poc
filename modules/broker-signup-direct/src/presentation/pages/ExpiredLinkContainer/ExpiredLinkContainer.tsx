import styles from './ExpiredLinkContainer.module.scss';
import LogoJuntoSeguros from '../../components/LogoJunto/LogoJuntoSeguros';

const ExpiredLinkContainer = () => {
  return (
    <div className={styles['expired-link-container__wrapper']}>
      <div className={styles['expired-link-container__header']}>
        <LogoJuntoSeguros />
      </div>
      <div className={styles['expired-link__signup-box']}>
        <div className={styles['expired-link-container__title']}>
          <span>Ops! Parece que tivemos um problema.</span>
        </div>
        <div className={styles['expired-link-container__information']}>
          <span>
            Infelizmente este link expirou. Precisamos que você solicite um novo
            link para criar seu acesso. Entre em contato conosco pelo Chat ou
            mande um e-mail para <a href="">faleconosco@juntoseguros.com</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExpiredLinkContainer;
