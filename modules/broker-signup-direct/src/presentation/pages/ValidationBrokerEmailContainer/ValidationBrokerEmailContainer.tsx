/* eslint-disable react/no-unescaped-entities */
import { RouteComponentProps } from 'react-router';
import { useCallback, useEffect, useState } from 'react';
import { LinkButton, Button, Modal } from 'junto-design-system';
import { useDispatch, useSelector } from 'react-redux';
import RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi';
import styles from './ValidationBrokerEmailContainer.module.scss';
import ValidationEmailCode from '../../components/ValidationEmailCode/ValidationEmailCode';
import {
  brokerInformationSliceActions,
  selectBroker,
} from '../../../application/features/brokerInformation/BrokerInformationSlice';
import {
  selectResponsibleInformation,
  responsibleInformationSliceActions,
} from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';
import { EMAIL_PROVIDER_LIST } from '../../../constants/emailProviderList';
import LogoJuntoSeguros from '../../components/LogoJunto/LogoJuntoSeguros';

const ValidationBrokerEmailContainer = ({ history }: RouteComponentProps) => {
  const broker = useSelector(selectBroker);
  const responsibleInformation = useSelector(selectResponsibleInformation);
  const [codeIsValid, setCodeIsValid] = useState(false);
  const [codeIsComplet, setCodeIsComplet] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisable] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(responsibleInformationSliceActions.setEmailHasValidated(false));
    if (broker.information.federalId === '') {
      history.push('/');
    }
  }, []);

  useEffect(() => {
    dispatch(brokerInformationSliceActions.setCodeIsValid(codeIsValid));
    if (codeIsValid && codeIsComplet) {
      setButtonDisable(false);
    } else {
      setTimeout(() => {
        setButtonDisable(false);
      }, 30000);
    }
  }, [codeIsValid, codeIsComplet]);

  const onSubmit = () => {
    const validationEmail = compareEmailBrokerToEmailResponsible();
    dispatch(
      brokerInformationSliceActions.setSignupDirect(
        broker.hasProductDamageInsurance &&
          broker.renewRegistration &&
          broker.susepSituation &&
          validationEmail,
      ),
    );
    fetchRegisterResponsibleBroker(validationEmail, broker.pathUpdate);
  };

  const onRetrySendEmail = async () => {
    await RegisterBrokerApi.SendValidationEmail(broker.pathUpdate)
      .then(() => setButtonDisable(true))
      .catch(error => error);
  };

  const compareEmailBrokerToEmailResponsible = () => {
    if (
      broker.information.email &&
      responsibleInformation.emailBroker &&
      broker.information.email.toUpperCase() ===
        responsibleInformation.emailBroker.toUpperCase()
    )
      return true;

    const brokerEmailDomain = broker.information.email.trim().split('@');
    const responsibleEmailDomain = responsibleInformation.emailBroker
      .trim()
      .split('@');

    if (brokerEmailDomain.length < 1 || responsibleEmailDomain.length < 1)
      return false;

    if (
      brokerEmailDomain[1].toUpperCase() ===
        responsibleEmailDomain[1].toUpperCase() &&
      !EMAIL_PROVIDER_LIST.includes(responsibleEmailDomain[1].toUpperCase())
    )
      return true;

    return false;
  };

  const fetchRegisterResponsibleBroker = useCallback(
    async (emailIsValid, pathUpdate) => {
      const payload = [
        {
          op: 'replace',
          path: '/emailIsValid',
          value: emailIsValid,
        },
      ];
      await RegisterBrokerApi.updateRegisterBroker(payload, pathUpdate).finally(
        () => {
          dispatch(
            responsibleInformationSliceActions.setEmailHasValidated(true),
          );
          history.push('/broker-details');
        },
      );
    },
    [],
  );

  return (
    <div className={styles['validation_broker_email_container_wrapper']}>
      <LogoJuntoSeguros />
      <div className={styles['validation_broker_email_container_section_form']}>
        <div
          className={
            styles['validation_broker_email_container_section_form_section']
          }
        >
          <h1>Enviamos um código para o seu e-mail</h1>
          <h2>
            Informe o código de 4 dígitos enviado para o e-mail{' '}
            <span>{responsibleInformation.emailBroker}</span>
          </h2>
          <ValidationEmailCode
            userPath={broker.pathUpdate}
            codeIsValid={codeIsValid}
            onSetCodeIsValid={setCodeIsValid}
            codeIsComplet={codeIsComplet}
            onSetCodeIsComplet={setCodeIsComplet}
          />
          <div
            className={
              styles['validation_broker_email_container_section_form_go_next']
            }
          >
            <Button
              id="validationBrokerEmail-onSubmit-button"
              data-testid="button-responsible-information-registry"
              size={codeIsValid && codeIsComplet ? 'large' : 'medium'}
              onClick={
                codeIsValid && codeIsComplet ? onSubmit : onRetrySendEmail
              }
              variant={codeIsValid && codeIsComplet ? 'primary' : 'secondary'}
              disabled={buttonDisabled}
            >
              {codeIsValid && codeIsComplet ? 'Continuar' : 'Enviar novamente'}
            </Button>
            <div
              className={
                styles[
                  'validation_broker_email_container_section_form_go_next_link_butoon'
                ]
              }
            >
              {!codeIsValid && (
                <LinkButton
                  id="validationBrokerEmail-openModalProblem-linkButton"
                  onClick={() => setIsOpen(true)}
                  label="Tive um problema"
                />
              )}

              <Modal
                size="large"
                open={isOpen}
                onBackdropClick={() => setIsOpen(false)}
                onClose={() => setIsOpen(false)}
              >
                <div
                  id="validationBrokerEmail-ihaveProblema-modal"
                  className={
                    styles['validation_broker_email_container_modal_text']
                  }
                >
                  <h1>Problemas no recebimento do código?</h1>
                  <p>
                    Pode ser que o e-mail que enviamos tenha sido direcionado
                    para a caixa de spam. Por favor, verifique a pasta de spam
                    no endereço de e-mail que você forneceu anteriormente. Se
                    não encontrá-lo, você pode solicitar um novo envio em alguns
                    segundos clicando no botão "Enviar novamente".
                  </p>
                  <p>
                    Se o problema persistir, entre em contato conosco por meio
                    do chat. Estamos aqui para ajudar.
                  </p>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidationBrokerEmailContainer;
