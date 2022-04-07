import styles from './NoAccessContainer.module.scss';
import { ReactComponent as Illustration } from './assets/no-access-illustration.svg';

const NoAccessContainer: React.FC = () => {
  return (
    <div className={styles['no-access-container__wrapper']}>
      <div className={styles['no-access-container__content']}>
        <h1>
          Em breve teremos uma <strong>nova experiência do Fidelize </strong>
          para você.
        </h1>
        <p>
          Aqui você conseguirá visualizar as oportunidades judiciais dos
          tomadores da sua carteira que foram mapeadas pelo Projeto Fidelize,
          numa interface que te proporcionará uma análise ainda mais eficaz.
        </p>
        <h2>Não perca a chance de fazer parte disso.</h2>
        <p>
          Fale com o seu comercial responsável e saiba se seus tomadores possuem
          oportunidades de negócio no âmbito judicial.
        </p>
      </div>
      <div className={styles['no-access-container__illustration']}>
        <Illustration />
      </div>
    </div>
  );
};

export default NoAccessContainer;
