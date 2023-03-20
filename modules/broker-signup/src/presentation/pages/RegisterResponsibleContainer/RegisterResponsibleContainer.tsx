import { RouteComponentProps } from 'react-router';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import styles from './RegisterResponsibleContainer.module.scss';
import ResponsibleInformation from '../../components/ResponsibleInformation';
import { HeaderPages } from '../../components/HeaderPages/HeaderPages'
import  RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi'
import { selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { selectResponsibleInformation } from '../../../application/features/responsibleInformation/ResponsibleInformationSlice';


const RegisterResponsibleContainer= ({ history }: RouteComponentProps) => {
  const responsibleInformation = useSelector(selectResponsibleInformation);
  const broker = useSelector(selectBroker);

  const handleGoBackClick = () => {
    history.push('/');
  };

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
          path: "/cpfResponsable",
          value: responsible.cpfResponsable.trim().replaceAll(/[./-]/g, '')
        },
        {
          op: "replace",
          path: "/phoneNumberResponsable",
          value: responsible.phoneNumberResponsable.replaceAll(/[()-]/g, '')
        },
        {
          op: "replace",
          path: "/emailBroker",
          value: responsible.emailBroker
        },
      ]
      await  RegisterBrokerApi.updateRegisterBroker(payload, pathUpdate)
    },
    [],
  );

  const onSubmit = () => {
    fetchRegisterResponsibleBroker(responsibleInformation,broker.pathUpdate);
    history.push('/broker-details');
  };

  return (
    <div className={styles['register_responsible_container__wrapper']}>
       <HeaderPages handleGoBackClick={handleGoBackClick}/>
      <div className={styles['register_responsible_container__title']}><span>Para começar, precisamos de alguns dados do responsável da corretora</span></div>
      <ResponsibleInformation onSubmit={onSubmit}/>
    </div>
  );
}

export default RegisterResponsibleContainer;
