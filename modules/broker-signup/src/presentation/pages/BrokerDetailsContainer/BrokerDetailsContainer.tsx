import { RouteComponentProps } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'junto-design-system';
import { BankDTO } from 'modules/broker-signup/src/application/types/dto';
import styles from './BrokerDetailsContainer.module.scss';
import { BrokerAddress } from '../../components/BrokerAddress/BrokerAddress'
import { BankDetails } from '../../components/BankDetails/BankDetails'
import { BrokerGeneralInformation } from '../../components/BrokerGeneralInformation/BrokerGeneralInformation'
import { HeaderPages } from '../../components/HeaderPages/HeaderPages'
import  ListBankApi from '../../../application/features/Bank/ListBankApi'
import  RegisterBrokerApi from '../../../application/features/RegisterBroker/RegisterBrokerApi'
import { brokerInformationSliceActions,selectBroker } from '../../../application/features/brokerInformation/BrokerInformationSlice';
import { validationActions, selectValidation } from '../../../application/features/validation/ValidationSlice';

const BrokerDetailsContainer= ({ history }: RouteComponentProps) => {

  const [isDisableGoNextStep, setIsDisableGoNextStep] = useState(true);
  const [bankOptions, setbankOptions] = useState<BankDTO[]>();
  const dispatch = useDispatch();
  const brokerInformation = useSelector(selectBroker);
  const { errors } = useSelector(selectValidation);
  const { bankDetails } = brokerInformation
  const { name,accounDigit,accounNumber,bankNumber } = bankDetails

  useEffect(() => {
    const hasBankDetailsNotInputEmpty = name !== '' && bankNumber && accounNumber && accounDigit !== ''

    const hasInputError = Object.values(errors).length

    if(hasBankDetailsNotInputEmpty && hasInputError === 0 &&  brokerInformation.susepCode !== ''){
     setIsDisableGoNextStep(false);
    }
    else{
      setIsDisableGoNextStep(true);
    }
  }, [accounDigit, accounNumber, bankNumber, brokerInformation.susepCode, errors, name]);

  const fetchBanks = useCallback(
    async () => {
      await  ListBankApi.getBanks()
      .then(response => { setbankOptions(response)})
      .catch(() => setIsDisableGoNextStep(true))
    },
    [],
  );

  const fetchRegisterResponsibleBroker = useCallback(
    async (broker,pathUpdate) => {
      const payload = [
        {
          op: "replace",
          path: "/bankName",
          value: broker.bankDetails.name
        },
        {
          op: "replace",
          path: "/bankNumber",
          value: broker.bankDetails.bankCode
        },
        {
          op: "replace",
          path: "/currentAccountNumber",
          value:  broker.bankDetails.accounNumber
        },
        {
          op: "replace",
          path: "/branchNumber",
          value:  broker.bankDetails.bankNumber
        },
        {
          op: "replace",
          path: "/digitalAgencyNumber",
          value:  broker.bankDetails.bankDigit
        },

        {
          op: "replace",
          path: "/digitalContactNumber",
          value: broker.bankDetails.accounDigit
        },
        {
          op: "replace",
          path: "/susepCode",
          value: broker.susepCode
        },
        {
          op: "replace",
          path: "/iss",
          value: broker.iss
        },
        {
          op: "replace",
          path: "/simplesOptant",
          value: broker.simplesOptant
        },
      ]
      await  RegisterBrokerApi.updateRegisterBroker(payload, pathUpdate)
    },
    [],
  );

  useEffect(() => {
    if(bankOptions === undefined){
      fetchBanks();
    }
  }, [bankOptions, fetchBanks]);

  const onSubmit = () => {
    fetchRegisterResponsibleBroker(brokerInformation, brokerInformation.pathUpdate);
    return '';
  };

  const handleGoBackClick = () => {
    history.push('/register-responsible');
  };

  function handleBankSelection(bank: BankDTO) {
    dispatch(brokerInformationSliceActions.setBank(bank));
    dispatch(validationActions.removeErrorMessage('bankName'));
  }

  return (
    <div className={styles['broker_details_container__wrapper']}>
      <HeaderPages handleGoBackClick={handleGoBackClick}/>
      <div className={styles['broker_details_container__title']}><span>Agora, revise e nos informe os demais dados da corretora</span></div>
      <BrokerAddress/>
      <BankDetails
       bankOptions={bankOptions || []}
       onSelectBank={handleBankSelection}
       />
      <BrokerGeneralInformation/>
      <div className={styles['broker_details_container__button']}>
        <Button
        data-testid="button-broker-details"
        onClick={() => onSubmit()}
        disabled={isDisableGoNextStep}
        >
          Avançar
        </Button>
      </div>
    </div>


  );
}

export default BrokerDetailsContainer;
