import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, LinkButton, Tooltip, CSATWidget } from 'junto-design-system';
import { RouteComponentProps } from 'react-router';
import styles from './FinishSignupContainer.module.scss';
import LogoJuntoSeguros from '../../components/LogoJunto/LogoJuntoSeguros';
import { ReactComponent as FinishIcon } from '../../assets/finishIcon.svg';
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { selectResponsibleInformation } from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';

import RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi';

const FinishSignupContainer = ({ history }: RouteComponentProps) => {
  const brokerInformation = useSelector(selectBroker);
  const responsabileInformation = useSelector(selectResponsibleInformation);

  const [copied, setCopied] = useState<boolean>(false);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [inviteId, setInviteId] = useState<string>('');
  const copyIconRef = useRef<HTMLButtonElement>(null);
  const loginPlatformUrl = process.env.NX_GLOBAL_BROKER_PLATFORM_URL || '';
  const [showCsatWidget, setShowCsatWidget] = useState<boolean>(true);
  const indecxActionId = brokerInformation.signupDirect
    ? process.env.NX_GLOBAL_INDECX_ACTION_ID_SIGNUP_DIRECT
    : process.env.NX_GLOBAL_INDECX_ACTION_ID_SIGNUP_INTERNALIZED;

  useEffect(() => {
    if (brokerInformation.brokerUserName === '') {
      history.push('/');
    }
  }, []);

  useEffect(() => {
    RegisterBrokerApi.getIndecxInviteId(
      indecxActionId || '',
      responsabileInformation.emailBroker,
      brokerInformation.information.brokerCompanyName,
    )
      .then(response => setInviteId(response.inviteId))
      .catch(() => setShowCsatWidget(false));
  }, []);

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

  const handleFeedbackSubmit = (score: number, feedback: string) => {
    const satisfactionSurveyPayload = {
      actionId: indecxActionId || '',
      email: responsabileInformation.emailBroker,
      name: brokerInformation.information.brokerCompanyName,
      score,
      feedback,
      inviteId,
    };
    RegisterBrokerApi.sendSatisfactionSurvey(satisfactionSurveyPayload);
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
              data-testid="copyBrokerLogin-button"
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
      <div className={styles['finish-signup-container__csat']}>
        {showCsatWidget && (
          <CSATWidget
            title="Como você avalia a sua experiência de cadastro na Junto?"
            finishMessage="Sua opinião é importante para nós."
            finishMessageTitle="Agradecemos a sua participação."
            modalTitle="Conta para gente o que motivou essa nota"
            placeholderForScoreEqualOrBelowThree="Como podemos melhorar?"
            placeholderForScoreEqualOrGreaterThanFour="Como foi a experiência de cadastro?"
            onFeedbackSubmit={(score: number, feedback: string) =>
              handleFeedbackSubmit(score, feedback)
            }
          />
        )}
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
