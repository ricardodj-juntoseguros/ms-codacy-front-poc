import { LinkButton, Button } from 'junto-design-system';
import styles from './EmissionContainer.module.scss';

export function EmissionContainer() {
  return (
    <div className={styles['j-emission-container']}>
      <div className={styles['j-emission-container__buttons--link']}>
        <LinkButton label="Baixar minuta" icon="download" size="large" />
        <LinkButton
          label="Certificado de regularidade"
          icon="external-link"
          size="large"
        />
      </div>

      <div className={styles['j-emission-container__button--download']}>
        <LinkButton label="Termos e condições" />
      </div>

      <div className={styles['j-emission-container__button--emission']}>
        <Button>Finalizar emissão</Button>
      </div>
    </div>
  );
}
