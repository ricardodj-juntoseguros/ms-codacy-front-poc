import { LinkButton, Button } from 'junto-design-system';
import styles from './EmissionContainer.module.scss';

export function EmissionContainer() {
  return (
    <div className={styles['j-emission-container']}>
      <div className={styles['j-emission-container_buttons-link']}>
        <LinkButton label="Baixar minuta" icon="download" />
        <LinkButton label="Certificado de regularidade" icon="external-link" />
      </div>

      <div className={styles['j-emission-container_button-download']}>
        <LinkButton label="Termos e condições" />
      </div>

      <div className={styles['j-emission-container_button-emission']}>
        <Button>Finalizar emissão</Button>
      </div>
    </div>
  );
}
