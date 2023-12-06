import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, LinkButton, Tooltip } from 'junto-design-system';
import { RouteComponentProps } from 'react-router';
import styles from './FinishSignupContainer.module.scss';
import LogoJuntoSeguros from '../../components/LogoJunto/LogoJuntoSeguros';
import { ReactComponent as FinishIcon } from '../../assets/finishIcon.svg';
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';

const FinishSignupContainer = ({ history }: RouteComponentProps) => {
  const brokerInformation = useSelector(selectBroker);

  const [copied, setCopied] = useState(false);

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const copyIconRef = useRef<HTMLButtonElement>(null);

  const loginPlatformUrl = process.env.NX_GLOBAL_BROKER_PLATFORM_URL || '';

  useEffect(() => {
    if (brokerInformation.brokerUserName === '') {
      history.push('/');
    }
  }, [brokerInformation.brokerUserName, history]);

  const handleCopyUsernameToClipboard = () => {
    navigator.clipboard
      .writeText(brokerInformation.brokerUserName)
      .then(() => setCopied(true));
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleGoToLoginPage = () => {
    window.location.assign(loginPlatformUrl);
  };

  return (
    <div className={styles['finish-signup-container__wrapper']}>
      <LogoJuntoSeguros />
      <div className={styles['finish_signup_box']}>
        <FinishIcon />
        <div className={styles['finish-signup-container__title']}>
          <div>
            <span>Vem Junto!</span>
          </div>
          <div>
            <span>Seu acesso está pronto</span>
          </div>
        </div>
        <div className={styles['finish-signup-container__information']}>
          <span>Use seu usuário para acessar a plataforma:</span>
        </div>
        <div className={styles['finish-signup-container__copy_username']}>
          <div
            className={
              styles['finish-signup-container__copy_username_username']
            }
          >
            <span>{brokerInformation.brokerUserName}</span>
          </div>
          <div className={styles['finish-signup-container__copy_icon']}>
            <LinkButton
              id="finishSignup-copyBrokerLogin-button"
              ref={copyIconRef}
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
              label=""
              onClick={handleCopyUsernameToClipboard}
              icon={copied ? 'check' : 'copy'}
              title="Copiar nome de usuário"
            />
          </div>
        </div>
      </div>
      <div className={styles['finish-signup-container__button']}>
        <Button
          id="finishSignup-redirectPlatform-button"
          data-testid="button-access-now"
          onClick={handleGoToLoginPage}
        >
          Acessar agora
        </Button>
      </div>
      <Tooltip
        anchorRef={copyIconRef}
        text={copied ? 'Copiado!' : 'Copiar usuário'}
        visible={tooltipVisible}
        position="top"
      />
    </div>
  );
};

export default FinishSignupContainer;
