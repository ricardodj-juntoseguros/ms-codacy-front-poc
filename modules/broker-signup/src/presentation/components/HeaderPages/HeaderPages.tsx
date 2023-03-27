import { LinkButton } from 'junto-design-system';
import styles from './HeaderPages.module.scss';
import { ReactComponent as LogoJunto } from '../../assets/logoJunto.svg';

export interface HeaderPagesProps {
  handleGoBackClick(): void;
 showLinkButton: boolean;
}

export function HeaderPages({
  handleGoBackClick,
  showLinkButton
}: HeaderPagesProps) {
  const sreenWidth = window.screen.width;

  return (
    <div className={styles['header_pages_container__wrapper']}>
      <div className={styles['header_pages_container__illustration']}>
        {showLinkButton &&
          <LinkButton
            data-testid="go-back-btn"
            onClick={() => handleGoBackClick()}
            label={sreenWidth > 680 ? 'VOLTAR' : '' }
            icon="arrow-left"
            />
        }
          <LogoJunto/>
      </div>
    </div>
  );
};
