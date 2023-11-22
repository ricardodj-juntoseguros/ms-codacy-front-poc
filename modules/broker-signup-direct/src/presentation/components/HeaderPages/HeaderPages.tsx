import TagManager from 'react-gtm-module';
import { useEffect, useState } from 'react';
import { LinkButton } from 'junto-design-system';
import styles from './HeaderPages.module.scss';
import { ReactComponent as LogoJunto } from '../../assets/logoJunto.svg';
import zenDesk from '../../../helpers/zenDesk';

export interface HeaderPagesProps {
  handleGoBackClick(): void;
  showLinkButton: boolean;
}

export function HeaderPages({
  handleGoBackClick,
  showLinkButton,
}: HeaderPagesProps) {
  const sreenWidth = window.screen.width;
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!showChat) {
      const gtmArgs = {
        gtmId: process.env.NX_PLATAFORM_GTM_KEY_GA_FLOW_SIGNUP || '',
      };
      TagManager.initialize(gtmArgs);
      zenDesk.init();
      setShowChat(true);
    }
  }, []);

  return (
    <div className={styles['header_pages_container__wrapper']}>
      <div className={styles['header_pages_container__illustration']}>
        {showLinkButton && (
          <LinkButton
            data-testid="go-back-btn"
            onClick={() => handleGoBackClick()}
            label={sreenWidth > 680 ? 'VOLTAR' : ''}
            icon="arrow-left"
          />
        )}
        <LogoJunto />
      </div>
    </div>
  );
}
