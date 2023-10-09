import { RouteComponentProps } from 'react-router';
import { LinkButton } from 'junto-design-system';
import { useCallback,useEffect , useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './RegisterResponsibleContainer.module.scss';
import ResponsibleInformation from '../../components/ResponsibleInformation';
import {TextHelper} from '../../components/TextHelper';
import  RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi'
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { selectResponsibleInformation } from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';
import { ReactComponent as LogoJunto } from '../../assets/logoJunto.svg';

const RegisterResponsibleContainer= ({ history }: RouteComponentProps) => {
  const responsibleInformation = useSelector(selectResponsibleInformation);
  const broker = useSelector(selectBroker);
  const brokerInformation = useSelector(selectBroker);
  const sreenWidth = window.screen.width;
  const [showTextHelper, setShowTextHelper] = useState(sreenWidth > 680);
  const textHelper = ["Dê preferência ao seu e-mail profissional. E se possível, com o domínio próprio da sua empresa.", "Lembre-se de que esse será o e-mail da pessoa responsável pelo relacionamento com a plataforma."]

  useEffect(() => {
    if(brokerInformation.information.federalId === ''){
      history.push('/');
    }
    },[brokerInformation.information.federalId]);

  const fetchRegisterResponsibleBroker = useCallback(
    async (responsible, pathUpdate) => {
      const payload = [
        {
          op: "replace",
          path: "/nameResponsable",
          value: responsible.nameResponsable
        },
        {
          op: "replace",
          path: "/emailBroker",
          value: responsible.emailBroker
        },
      ]
      await  RegisterBrokerApi.updateRegisterBroker(payload, pathUpdate)
      .finally(() => fetchSendEmailValidationCode(pathUpdate))
    },
    [],
  );

  const fetchSendEmailValidationCode = async (pathUpdate :string) => {
    await RegisterBrokerApi.SendValidationEmail(pathUpdate)
    // .finally(() => history.push('/broker-details'))
  }

  const onSubmit = async () => {
    fetchRegisterResponsibleBroker(responsibleInformation,broker.pathUpdate);
  };

  return (
    <div className={styles['register_responsible_container_wrapper']}>
    <div className={styles['register_responsible_container_section_form_logo']}>
     <LogoJunto />
     </div>
    <div className={styles['register_responsible_container_section_form']}>
        <div className={styles['register_responsible_container_section_form_section']}>
          <h1>Informe seu nome e e-mail</h1>
          <h2>Você receberá as credenciais de acesso no e-mail informado.</h2>
          <ResponsibleInformation onSubmit={onSubmit}/>
        </div>
        { sreenWidth <= 680 &&
           <div className={styles['register_responsible_container_section_form_show_text_helper']}>
          <LinkButton onClick={() => setShowTextHelper(!showTextHelper)} label="Qual e-mail eu devo informar?" icon={!showTextHelper ? "help-circle" : "chevron-up"} iconPosition="left"/>
          </div>
         }
    </div>
  {showTextHelper &&
    <TextHelper title="Qual e-mail eu devo informar?" text={textHelper} />
  }
 </div>
);
}

export default RegisterResponsibleContainer;
