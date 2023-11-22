import { RouteComponentProps } from 'react-router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Alert, Button, LinkButton } from 'junto-design-system';
import styles from './BrokerDataReviewContainer.module.scss';
import {
  selectBroker,
  brokerInformationSliceActions,
} from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { selectResponsibleInformation } from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';
import { ReactComponent as LogoJunto } from '../../assets/logoJunto.svg';
import { useAppDispatch } from '../../../config/store';
import RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi';

const BrokerDataReviewContainer = ({ history }: RouteComponentProps) => {
  const dispatch = useAppDispatch();
  const responsibleInformation = useSelector(selectResponsibleInformation);
  const broker = useSelector(selectBroker);
  const brokerInformation = useSelector(selectBroker);
  const sreenWidth = window.screen.width;

  useEffect(() => {
    if (brokerInformation.information.federalId === '') {
      history.push('/');
    }
    if (
      brokerInformation.information.federalId !== '' &&
      responsibleInformation.emailBroker !== '' &&
      !responsibleInformation.emailHasValidated
    ) {
      history.push('/validation-email');
    }
  }, [brokerInformation.information.federalId]);

  const fetchRegisterResponsibleBrokerGv = async () => {
    await RegisterBrokerApi.registerBrokerGV(brokerInformation.pathUpdate)
      .then(response => {
        dispatch(
          brokerInformationSliceActions.setBrokerExternalId(
            response as unknown as number,
          ),
        );
      })
      .finally(() => {
        history.push('/create-user-access');
      });
  };

  const onSubmit = () => {
    fetchRegisterResponsibleBrokerGv();
  };

  const renderButtonEdit = (route: string, id: string) => {
    return (
      <div
        className={
          styles[
            'broker_data_review_container_section_form_broker_data_contet_button'
          ]
        }
      >
        <LinkButton
          id={id}
          data-testid="header-back-btn"
          label="Editar"
          icon="edit"
          onClick={() => goNextRoute(route)}
        />
      </div>
    );
  };

  const goNextRoute = async (route: string) => {
    history.push(route);
    if (route === '/register-responsible') {
      dispatch(brokerInformationSliceActions.setCodeIsValid(false));
    }
  };

  return (
    <div className={styles['broker_data_review_container__wrapper']}>
      <div className={styles['broker_data_review_container_container_logo']}>
        <LogoJunto />
      </div>
      <div className={styles['broker_data_review_container_section_form']}>
        <div className={styles['broker_data_review_container_title']}>
          <span>Antes de continuar, revise seus dados</span>
        </div>
        <div
          className={
            styles['broker_data_review_container_section_form_broker_data']
          }
        >
          <div
            className={
              styles[
                'broker_data_review_container_section_form_broker_data_contet'
              ]
            }
          >
            <h1>{broker.information.brokerCompanyName}</h1>
            <h3>CNPJ</h3>
            <h5>{broker.information.federalId}</h5>
          </div>
        </div>
        <div
          className={
            styles['broker_data_review_container_section_form_broker_data']
          }
        >
          <div
            className={
              styles[
                'broker_data_review_container_section_form_broker_data_contet'
              ]
            }
          >
            <div
              className={
                styles[
                  'broker_data_review_container_section_form_broker_data_contet_header'
                ]
              }
            >
              <div>
                <h1>Pessoa corretora responsável</h1>
              </div>
              {renderButtonEdit(
                '/register-responsible',
                'brokerDataReview-editResponsible-button',
              )}
            </div>
            <h3>Nome completo</h3>
            <h5>{responsibleInformation.nameResponsable}</h5>
            <h3>E-mail da corretora</h3>
            <h5>{responsibleInformation.emailBroker}</h5>
          </div>
        </div>
        <div
          className={
            styles['broker_data_review_container_section_form_broker_data']
          }
        >
          <div
            className={
              styles[
                'broker_data_review_container_section_form_broker_data_contet'
              ]
            }
          >
            <div
              className={
                styles[
                  'broker_data_review_container_section_form_broker_data_contet_header'
                ]
              }
            >
              <div>
                <h1>Dados de cadastro</h1>
              </div>
              {renderButtonEdit(
                '/broker-details',
                'brokerDataReview-editBrokerDetails-button',
              )}
            </div>
            <h3>CPF do responsável</h3>
            <h5>{responsibleInformation.cpfResponsable}</h5>
            <h3>Telefone</h3>
            <h5>{responsibleInformation.phoneNumberResponsable}</h5>
            <h3>Banco</h3>
            <h5>{broker.bankDetails.name}</h5>
            <div
              className={
                styles[
                  'broker_data_review_container_section_form_broker_data_contet_bank_information'
                ]
              }
            >
              <div>
                <h3>Agência</h3>
                <h5>
                  {broker.bankDetails.bankNumber}
                  {broker.bankDetails.bankDigit !== ''
                    ? -broker.bankDetails.bankDigit
                    : ''}
                </h5>
              </div>
              <div>
                <h3>Conta</h3>
                <h5>
                  {broker.bankDetails.accounNumber}-
                  {broker.bankDetails.accounDigit}
                </h5>
              </div>
            </div>
            <h3>Percentual ISS</h3>
            <h5>{broker.iss}%</h5>
          </div>
        </div>
        <div className={styles['broker_data_review_container_alert']}>
          <Alert
            text="Importante: A conta bancária deve ser uma conta jurídica atrelada ao CNPJ da corretora. Por favor, reforçamos que verifique os dados bancários e caso necessário edite."
            variant="info"
            width={sreenWidth > 680 ? 640 : sreenWidth * 0.87}
            icon="alert-circle"
          />
        </div>
        <div className={styles['broker_data_review_button']}>
          <Button
            id="brokerDataReview-subimit-button"
            data-testid="button-broker-details"
            onClick={() => onSubmit()}
          >
            Continuar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrokerDataReviewContainer;
